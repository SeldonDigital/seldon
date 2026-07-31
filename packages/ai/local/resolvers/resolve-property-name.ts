import { findComponentSchema } from "@seldon/core/components/catalog"
import { COMPOUND_FACET_DISPLAY_ORDER } from "@seldon/core/properties/constants/shared/compound-properties"
import { joinCompoundFacetKey } from "@seldon/core/properties/schemas/helpers/property-path"

import { SHORTHAND_SIDES, propertyShape } from "../../prompt/property-taxonomy"
import { buildResolvePropertyNamesStage } from "../../prompt/stages/resolve-property-name"
import { callOllamaFormat } from "../ollama-client"
import { type TurnContext, recordStep } from "../turn-context"

/**
 * Every property key a component's nodes accept, flattened to the dotted paths
 * the repair pass understands: atomic keys as-is, compound/layered keys as
 * `key.facet`, shorthand keys as both the parent and each `key.side`.
 */
export function settablePropertyKeys(catalogId: string): string[] {
  const componentSchema = findComponentSchema(catalogId)
  const componentHasNoProperties = !componentSchema?.properties
  if (componentHasNoProperties) return []
  const settableKeys: string[] = []
  for (const key of Object.keys(componentSchema.properties)) {
    const keyShape = propertyShape(key)
    if (keyShape === "atomic") {
      settableKeys.push(key)
    } else if (keyShape === "compound" || keyShape === "layered") {
      for (const facet of COMPOUND_FACET_DISPLAY_ORDER[key] ?? []) {
        settableKeys.push(joinCompoundFacetKey(key, facet))
      }
    } else if (keyShape === "shorthand") {
      settableKeys.push(key)
      for (const side of SHORTHAND_SIDES[key] ?? []) {
        settableKeys.push(`${key}.${side}`)
      }
    }
  }
  return settableKeys
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
  const settableKeys = settablePropertyKeys(catalogId)
  const componentHasNoSettableProperties = settableKeys.length === 0
  if (componentHasNoSettableProperties) {
    return {
      kind: "message",
      text: `Component "${catalogId}" has no settable properties.`,
    }
  }

  const { prompt, schema } = buildResolvePropertyNamesStage({
    message: context.message,
    catalogId,
    keys: settableKeys,
  })

  const { value: nameAnswer, metrics } = await callOllamaFormat<{
    keys: string[]
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)

  // Belt and braces: the grammar should already restrict items to the enum,
  // but array-of-enum wasn't in the spike's tested envelope, so re-filter.
  const knownKeys = new Set(settableKeys)
  const requestedKeys = [...new Set(nameAnswer.keys)].filter((key) =>
    knownKeys.has(key),
  )
  const namesWereResolved = requestedKeys.length > 0
  recordStep(context, "resolve_property_name", {
    ok: namesWereResolved,
    prompt,
    output: JSON.stringify(nameAnswer, null, 2),
  })

  if (!namesWereResolved) {
    return {
      kind: "message",
      text: `I couldn't tell which property of the ${catalogId} you want to change. Name it explicitly (for example: its color, size, or text).`,
    }
  }
  return { kind: "resolved", keys: requestedKeys }
}
