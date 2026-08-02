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
import { buildResolvePropertyValueStage } from "../../prompt/stages/resolve-property-value"
import { callOllamaFormat } from "../ollama-client"
import { type TurnContext, recordStep } from "../turn-context"
import { isSwatchColorProperty, resolveColorValue } from "./resolve-color-value"

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

/** Prose unit words to the Unit suffixes core's exact validators store. */
const UNIT_BY_WORD: Record<string, string> = {
  px: "px",
  pixel: "px",
  pixels: "px",
  rem: "rem",
  "%": "%",
  percent: "%",
  deg: "deg",
  degree: "deg",
  degrees: "deg",
}

/**
 * Parses a prose length ("100 pixels", "2rem", "50%", "100") into the
 * `{value, unit}` object a unit-bearing exact validator accepts. Core
 * rejects the prose form outright ("width doesn't accept an exact value of
 * 100 pixels"), and asking the model for the structured form is asking it
 * to author the committed value -- the same mistake the color pipeline
 * removed. A missing unit falls to the schema's default; an unparseable or
 * disallowed answer returns undefined and passes through untouched, so the
 * reducer's validation stays the final honest gate.
 */
export function parseExactLength(
  rawValue: string | number,
  allowedUnits: readonly string[],
  defaultUnit: string | undefined,
): { value: number; unit: string } | undefined {
  if (typeof rawValue === "number") {
    const unitForBareNumber = defaultUnit ?? allowedUnits[0]
    if (unitForBareNumber === undefined) return undefined
    return { value: rawValue, unit: unitForBareNumber }
  }
  const lengthMatch = rawValue
    .trim()
    .match(/^(-?\d+(?:\.\d+)?)\s*([a-z%]+)?$/i)
  if (lengthMatch === null) return undefined
  const numericValue = Number(lengthMatch[1])
  const spokenUnit = lengthMatch[2]?.toLowerCase()
  const resolvedUnit =
    spokenUnit !== undefined
      ? UNIT_BY_WORD[spokenUnit]
      : (defaultUnit ?? allowedUnits[0])
  const unitIsUsable =
    resolvedUnit !== undefined && allowedUnits.includes(resolvedUnit)
  if (!unitIsUsable) return undefined
  return { value: numericValue, unit: resolvedUnit }
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

  // Swatch-backed color properties resolve through their own pipeline: Core
  // rejects CSS color names as exact values and bare swatch keys as theme
  // references, so the generic option/theme/exact stage cannot produce a
  // storable color reliably.
  const propertyIsSwatchColor = isSwatchColorProperty(schemaKey)
  if (propertyIsSwatchColor) {
    return resolveColorValue(context, propertyKey, schemaKey)
  }

  const firstWorkspaceTheme = workspaceTheme(context.state.workspace)

  const presetOptions = getPresetOptions(schemaKey).map(String)
  const themeReferenceTag = themeRefTag(schemaKey)
  const themeTokens = themeReferenceTag
    ? getPropertyOptions(
        schemaKey,
        themeReferenceTag === "theme.ordinal"
          ? "themeOrdinal"
          : "themeCategorical",
        firstWorkspaceTheme,
      ).map(String)
    : []
  const allowedUnits = getPropertySchema(schemaKey)?.units?.allowed ?? []

  const { prompt, schema } = buildResolvePropertyValueStage({
    propertyKey,
    message: context.message,
    options: presetOptions,
    themeTokens,
    units: [...allowedUnits],
  })

  const { value: valuePick, metrics } = await callOllamaFormat<ValuePick>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_property_value", {
    ok: true,
    prompt,
    output: JSON.stringify(valuePick, null, 2),
  })

  // Tag deterministically from the pick. Theme tokens get their tag from the
  // property's own schema (the model never writes a type string); option and
  // exact values pass loose and the repair pass wraps them.
  const pickIsThemeToken =
    valuePick.pick === "theme" && themeReferenceTag !== undefined
  if (pickIsThemeToken) {
    return {
      kind: "resolved",
      value: { type: themeReferenceTag, value: valuePick.value },
    }
  }
  // A unit-bearing exact answer arrives as prose ("100 pixels") and the
  // schema wants {value, unit} -- the parse is arithmetic over words that
  // are sitting right there, so it happens here, not in the model. Returned
  // pre-tagged: the repair pass walks INTO untagged objects and would wrap
  // the value and unit leaves separately.
  const pickIsUnitBearingExact =
    valuePick.pick === "exact" && allowedUnits.length > 0
  if (pickIsUnitBearingExact) {
    const parsedLength = parseExactLength(
      valuePick.value,
      [...allowedUnits],
      getPropertySchema(schemaKey)?.units?.default,
    )
    if (parsedLength !== undefined) {
      return { kind: "resolved", value: { type: "exact", value: parsedLength } }
    }
  }
  return { kind: "resolved", value: valuePick.value }
}
