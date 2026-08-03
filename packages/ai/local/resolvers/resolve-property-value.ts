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
import { buildResolveUnitWordStage } from "../../prompt/stages/resolve-unit-word"
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

/** The unit-word stage's answer: a canonical suffix, or a refusal. */
interface UnitWordPick {
  pick: "unit" | "unsupported"
  value?: string
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
 * What the deterministic pass made of the model's exact answer. `unknownUnit`
 * carries the amount forward so the repair call only has to name the unit and
 * never has to re-read the number.
 */
export type ExactLengthParse =
  | { kind: "parsed"; measure: { value: number; unit: string } }
  | { kind: "unknownUnit"; amount: number; spokenUnit: string }
  | { kind: "notALength" }

/**
 * Reads a prose length ("100px", "2rem", "50%", "100") into the `{value, unit}`
 * object a unit-bearing exact validator accepts, using only core's own
 * `units.allowed` as the vocabulary. This package deliberately holds no table
 * of unit words: a synonym it cannot derive is escalated as `unknownUnit`
 * rather than guessed, so adding a unit to core cannot leave a stale copy here.
 */
export function parseExactLength(
  rawValue: string | number,
  allowedUnits: readonly string[],
  defaultUnit: string | undefined,
): ExactLengthParse {
  const unitWhenNoneIsSpoken = defaultUnit ?? allowedUnits[0]

  if (typeof rawValue === "number") {
    if (unitWhenNoneIsSpoken === undefined) return { kind: "notALength" }
    return {
      kind: "parsed",
      measure: { value: rawValue, unit: unitWhenNoneIsSpoken },
    }
  }

  const lengthMatch = rawValue.trim().match(/^(-?\d+(?:\.\d+)?)\s*([a-z%]+)?$/i)
  if (lengthMatch === null) return { kind: "notALength" }
  const amount = Number(lengthMatch[1])
  const spokenUnit = lengthMatch[2]?.toLowerCase()

  const noUnitWasSpoken = spokenUnit === undefined
  if (noUnitWasSpoken) {
    if (unitWhenNoneIsSpoken === undefined) return { kind: "notALength" }
    return {
      kind: "parsed",
      measure: { value: amount, unit: unitWhenNoneIsSpoken },
    }
  }

  const unitIsAlreadyCanonical = allowedUnits.includes(spokenUnit)
  if (unitIsAlreadyCanonical) {
    return { kind: "parsed", measure: { value: amount, unit: spokenUnit } }
  }

  // "degrees" -> "deg" is the one synonym a rule can derive, because the
  // canonical suffix is a prefix of the spoken word. "pixels" -> "px" and
  // "percent" -> "%" are not derivable by any rule, so they escalate.
  const suffixedUnit = allowedUnits.find((allowedUnit) =>
    spokenUnit.startsWith(allowedUnit),
  )
  if (suffixedUnit !== undefined) {
    return { kind: "parsed", measure: { value: amount, unit: suffixedUnit } }
  }

  return { kind: "unknownUnit", amount, spokenUnit }
}

/**
 * Turns the model's exact answer into the `{value, unit}` object core stores,
 * escalating only as far as it has to. The deterministic parse settles a
 * canonical or suffixed unit for free; a spoken synonym costs one
 * enum-constrained call whose choices are core's `units.allowed`; a unit the
 * property cannot measure in stops the turn with a clarification instead of
 * being coerced into a plausible-looking wrong value.
 *
 * Returned pre-tagged: the repair pass walks INTO untagged objects and would
 * wrap the value and unit leaves separately.
 */
async function resolveExactMeasure(
  context: TurnContext,
  inputs: {
    propertyKey: string
    rawValue: string | number
    allowedUnits: string[]
    defaultUnit: string | undefined
  },
): Promise<PropertyValueResolution> {
  const lengthParse = parseExactLength(
    inputs.rawValue,
    inputs.allowedUnits,
    inputs.defaultUnit,
  )
  if (lengthParse.kind === "parsed") {
    return {
      kind: "resolved",
      value: { type: "exact", value: lengthParse.measure },
    }
  }
  // An answer that is not a measurement at all ("auto") passes through
  // untouched, keeping the reducer's validation as the final honest gate.
  if (lengthParse.kind === "notALength") {
    return { kind: "resolved", value: inputs.rawValue }
  }

  const unitStage = buildResolveUnitWordStage({
    propertyKey: inputs.propertyKey,
    spokenUnit: lengthParse.spokenUnit,
    allowedUnits: inputs.allowedUnits,
  })
  const { value: unitPick, metrics } = await callOllamaFormat<UnitWordPick>({
    model: context.model,
    host: context.host,
    prompt: unitStage.prompt,
    schema: unitStage.schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_unit_word", {
    ok: true,
    prompt: unitStage.prompt,
    output: JSON.stringify(unitPick, null, 2),
  })

  const namedUnit = unitPick.pick === "unit" ? unitPick.value : undefined
  const unitIsUsable =
    namedUnit !== undefined && inputs.allowedUnits.includes(namedUnit)
  if (unitIsUsable) {
    return {
      kind: "resolved",
      value: {
        type: "exact",
        value: { value: lengthParse.amount, unit: namedUnit },
      },
    }
  }

  return {
    kind: "message",
    text: `"${lengthParse.spokenUnit}" isn't a unit ${inputs.propertyKey} accepts. Use ${inputs.allowedUnits.join(", ")}, then ask again.`,
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
  const propertySchema = getPropertySchema(schemaKey)
  const allowedUnits = propertySchema?.units?.allowed ?? []
  const supportsExact = propertySchema?.supports.includes("exact") ?? false

  const { prompt, schema } = buildResolvePropertyValueStage({
    propertyKey,
    message: context.message,
    options: presetOptions,
    themeTokens,
    units: [...allowedUnits],
    supportsExact,
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
  const pickIsUnitBearingExact =
    valuePick.pick === "exact" && allowedUnits.length > 0
  if (pickIsUnitBearingExact) {
    return resolveExactMeasure(context, {
      propertyKey,
      rawValue: valuePick.value,
      allowedUnits: [...allowedUnits],
      defaultUnit: propertySchema?.units?.default,
    })
  }
  return { kind: "resolved", value: valuePick.value }
}
