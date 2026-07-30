import { findComponentSchema } from "@seldon/core/components/catalog"
import { COMPOUND_FACET_DISPLAY_ORDER } from "@seldon/core/properties/constants/shared/compound-properties"
import { joinCompoundFacetKey } from "@seldon/core/properties/schemas/helpers/property-path"

import { SHORTHAND_SIDES, propertyShape } from "../../prompt/property-taxonomy"
import { callOllamaFormat } from "../ollama-client"
import { type TurnContext, recordStep } from "../turn-context"

/**
 * Every property key a component's nodes accept, flattened to the dotted paths
 * the repair pass understands: atomic keys as-is, compound/layered keys as
 * `key.facet`, shorthand keys as both the parent and each `key.side`.
 */
export function settablePropertyKeys(catalogId: string): string[] {
  const schema = findComponentSchema(catalogId)
  if (!schema?.properties) return []
  const keys: string[] = []
  for (const key of Object.keys(schema.properties)) {
    const shape = propertyShape(key)
    if (shape === "atomic") {
      keys.push(key)
    } else if (shape === "compound" || shape === "layered") {
      for (const facet of COMPOUND_FACET_DISPLAY_ORDER[key] ?? []) {
        keys.push(joinCompoundFacetKey(key, facet))
      }
    } else if (shape === "shorthand") {
      keys.push(key)
      for (const side of SHORTHAND_SIDES[key] ?? []) {
        keys.push(`${key}.${side}`)
      }
    }
  }
  return keys
}

/**
 * Outcome of resolving which properties the message wants to change, following
 * the uniform contract: keys, or one terminal clarification message.
 */
export type PropertyNameResolution =
  | { kind: "resolved"; keys: string[] }
  | { kind: "message"; text: string }

/**
 * Resolves the property key(s) a message targets on one component with a
 * single enum-constrained call. One message may set several properties of one
 * node ("make it red and bold"), so the answer is an array; every item is
 * still re-validated in code against the known key set, since the spike only
 * covered scalar enum fields, not arrays of them.
 */
export async function resolvePropertyNames(
  context: TurnContext,
  catalogId: string,
): Promise<PropertyNameResolution> {
  const keys = settablePropertyKeys(catalogId)
  if (keys.length === 0) {
    return {
      kind: "message",
      text: `Component "${catalogId}" has no settable properties.`,
    }
  }

  const prompt = [
    `A user wants to change one or more properties of a "${catalogId}" element.`,
    "",
    `Message: ${JSON.stringify(context.message)}`,
    "",
    "Settable property keys:",
    keys.map((key) => `- ${key}`).join("\n"),
    "",
    "Answer with the key(s) the message asks to change. Pick only keys from the list.",
  ].join("\n")

  const { value, metrics } = await callOllamaFormat<{ keys: string[] }>({
    model: context.model,
    host: context.host,
    prompt,
    schema: {
      type: "object",
      properties: {
        keys: {
          type: "array",
          items: { type: "string", enum: keys },
          minItems: 1,
        },
      },
      required: ["keys"],
    },
  })
  context.calls.push(metrics)

  // Belt and braces: the grammar should already restrict items to the enum,
  // but array-of-enum wasn't in the spike's tested envelope, so re-filter.
  const known = new Set(keys)
  const picked = [...new Set(value.keys)].filter((key) => known.has(key))
  recordStep(context, "resolve_property_name", picked.length > 0, {
    prompt,
    output: JSON.stringify(value, null, 2),
  })

  if (picked.length === 0) {
    return {
      kind: "message",
      text: `I couldn't tell which property of the ${catalogId} you want to change. Name it explicitly (for example: its color, size, or text).`,
    }
  }
  return { kind: "resolved", keys: picked }
}
