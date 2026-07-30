import { getPropertySchema } from "@seldon/core/properties/schemas/helpers/get-property-schema"
import {
  getPresetOptions,
  getPropertyOptions,
} from "@seldon/core/properties/schemas/helpers/property-options"
import { getCatalogKeyForPropertyPath } from "@seldon/core/properties/schemas/helpers/property-path"
import type { Theme } from "@seldon/core/themes/types"
import { computeWorkspaceThemes } from "@seldon/core/workspace/compute"
import type { Workspace } from "@seldon/core/workspace/types"

import { themeRefTag } from "../../prompt/property-taxonomy"
import { callOllamaFormat } from "../ollama-client"
import { type TurnContext, recordStep } from "../turn-context"

/**
 * Outcome of resolving one property's value from the message. `resolved`
 * carries the loose value to put in the action's properties map -- the
 * deterministic repair pass (`normalizeActions`) tags it into the exact
 * `{type, value}` shape the reducer stores, and the reducer's own validation
 * is the final gate. `message` is a terminal clarification.
 */
export type PropertyValueResolution =
  | { kind: "resolved"; value: unknown }
  | { kind: "message"; text: string }

/** The model's answer: which value family it picked and the value itself. */
interface ValuePick {
  pick: "option" | "theme" | "exact"
  value: string | number
}

/** The workspace's first computed theme, or undefined when computing throws. */
function workspaceTheme(workspace: Workspace): Theme | undefined {
  try {
    return computeWorkspaceThemes(workspace)[0] as unknown as Theme | undefined
  } catch {
    return undefined
  }
}

/**
 * Resolves the value for one property key with a single shallow-tagged-union
 * call, mirroring the deterministic-first choice order the editor itself
 * offers: the property's preset options, its theme tokens, or a free exact
 * value. The union only carries the branches this property actually supports,
 * and the option/theme branches are enum-constrained to real choices, so the
 * model's judgment is limited to picking -- it cannot invent a token.
 */
export async function resolvePropertyValue(
  context: TurnContext,
  propertyKey: string,
): Promise<PropertyValueResolution> {
  const schemaKey = getCatalogKeyForPropertyPath(propertyKey) ?? propertyKey
  const theme = workspaceTheme(context.state.workspace)

  const options = getPresetOptions(schemaKey).map(String)
  const themeTag = themeRefTag(schemaKey)
  const themeTokens = themeTag
    ? getPropertyOptions(
        schemaKey,
        themeTag === "theme.ordinal" ? "themeOrdinal" : "themeCategorical",
        theme,
      ).map(String)
    : []
  const units = getPropertySchema(schemaKey)?.units?.allowed ?? []

  const branches: Record<string, unknown>[] = []
  const guidance: string[] = []
  if (options.length > 0) {
    branches.push({
      properties: {
        pick: { const: "option" },
        value: { type: "string", enum: options },
      },
      required: ["pick", "value"],
    })
    guidance.push(`- preset options: ${options.join(", ")}`)
  }
  if (themeTokens.length > 0) {
    branches.push({
      properties: {
        pick: { const: "theme" },
        value: { type: "string", enum: themeTokens },
      },
      required: ["pick", "value"],
    })
    guidance.push(`- theme tokens: ${themeTokens.join(", ")}`)
  }
  branches.push({
    properties: {
      pick: { const: "exact" },
      value: { type: ["string", "number"] },
    },
    required: ["pick", "value"],
  })
  guidance.push(
    units.length > 0
      ? `- an exact value: a number (${units.join("|")}) or a string`
      : "- an exact value: a string or number",
  )

  const prompt = [
    `A user wants to set the "${propertyKey}" property of a design element.`,
    "",
    `Message: ${JSON.stringify(context.message)}`,
    "",
    "The property accepts:",
    ...guidance,
    "",
    "Prefer a preset option or theme token when one matches the request; use exact only for a free value. Answer with the pick and the value.",
  ].join("\n")

  const { value, metrics } = await callOllamaFormat<ValuePick>({
    model: context.model,
    host: context.host,
    prompt,
    schema: { type: "object", oneOf: branches },
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_property_value", true, {
    prompt,
    output: JSON.stringify(value, null, 2),
  })

  // Tag deterministically from the pick. Theme tokens get their tag from the
  // property's own schema (the model never writes a type string); option and
  // exact values pass loose and the repair pass wraps them.
  if (value.pick === "theme" && themeTag) {
    return { kind: "resolved", value: { type: themeTag, value: value.value } }
  }
  return { kind: "resolved", value: value.value }
}
