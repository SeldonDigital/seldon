import { findInObject } from "@seldon/core/helpers"
import { ValueType } from "@seldon/core/properties"
import type { Value } from "@seldon/core/properties/types/value"
import type { ThemeTokenSchema } from "@seldon/core/themes/schemas"
import type { Theme } from "@seldon/core/themes/types"
import { getOverrideAtPath } from "@seldon/core/workspace/helpers/general/override-paths"
import { getThemeOverridePath } from "@seldon/core/workspace/helpers/themes/theme-override-paths"
import type { EntryThemeOverrides } from "@seldon/core/workspace/types"

/**
 * Framework-neutral read side for theme token rows.
 *
 * Reads a token's backing value from a computed theme, resolves the units a
 * numeric token accepts, and tells whether the entry overrides a token. Both the
 * React (`flattenThemeProperties`) and Vue (`buildThemeTokenRows`) builders share
 * this so the two editors read identical values; each shapes its own row model on
 * top.
 */

const VALUE_TYPES = new Set<unknown>(Object.values(ValueType))

/** Top-level group keys in the Computed section; their facets read from `parameters`. */
export const COMPUTED_GROUP_KEYS = new Set([
  "modulation",
  "colorHarmony",
  "displayMode",
  "fontFamily",
  "matchColor",
  "highContrast",
  "opticalPadding",
  "autoFit",
])

/**
 * Sections whose `.step` slot reads `parameters.step`. `lineHeight` is absent
 * because its dedicated branch in {@link getThemeValueByKey} handles every
 * `lineHeight.*.step` key first.
 */
export const MODULATION_STEP_SECTIONS = new Set([
  "size",
  "dimension",
  "margin",
  "padding",
  "gap",
  "fontSize",
  "borderWidth",
  "corners",
  "blur",
  "spread",
])

/** Look-token sections whose facets read from `parameters[facet]`. */
export const PARAMETER_SECTIONS = new Set([
  "shadow",
  "border",
  "gradient",
  "background",
  "font",
  "scrollbar",
])

/** Read-only harmony swatch rows resolved from the theme's color computation. */
export const CALCULATED_SWATCHES = new Set([
  "swatch.harmony.white",
  "swatch.harmony.gray",
  "swatch.harmony.black",
  "swatch.harmony.primary",
  "swatch.harmony.swatch1",
  "swatch.harmony.swatch2",
  "swatch.harmony.swatch3",
  "swatch.harmony.swatch4",
])

/** Color-point keys mapped to the computed swatch that fills their icon. */
export const COLOR_POINT_SWATCHES: Record<string, "white" | "gray" | "black"> =
  {
    "colorHarmony.whitePoint": "white",
    "colorHarmony.grayPoint": "gray",
    "colorHarmony.blackPoint": "black",
  }

export type HslObject = {
  hue: number
  saturation: number
  lightness: number
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object"
}

export function isHslObject(value: unknown): value is HslObject {
  return isRecord(value) && "hue" in value
}

/** Tells whether a raw theme value is already a property-style tagged value. */
export function asTaggedValue(value: unknown): Value | null {
  if (isRecord(value) && "type" in value && VALUE_TYPES.has(value.type)) {
    return value as Value
  }
  return null
}

/**
 * Resolves the allowed unit suffixes for a numeric theme row from its core token
 * schema, so display and validation share one source instead of hardcoded
 * per-key lists. Non-numeric rows (colors, enums, free text) and rows without a
 * declared unit return undefined, which lets validation keep its existing path.
 * A `rem` length row accepts both `px` and `rem`; a `none` unit is unitless.
 */
export function themeUnitsFromSchema(
  schema: ThemeTokenSchema,
): string[] | undefined {
  if (schema.controlType !== "number") return undefined
  switch (schema.unit?.type) {
    case "none":
      return []
    case "%":
      return ["%"]
    case "deg":
      return ["deg"]
    case "px":
      return ["px"]
    case "rem":
      return ["px", "rem"]
    default:
      return undefined
  }
}

/**
 * Reads a theme value by its dot-notation schema key, e.g.:
 * - "modulation.ratio" -> theme.modulation.parameters.ratio
 * - "colorHarmony.whitePoint" -> theme.colorHarmony.parameters.whitePoint
 * - "swatch.primary" -> theme.swatch.primary.value
 * - "size.medium.step" -> theme.size.medium.parameters.step
 * - "shadow.moderate.offsetX" -> theme.shadow.moderate.parameters.offset.x
 * - "border.hairline.width" -> theme.border.hairline.parameters.width
 *
 * Returns undefined for keys that have no backing value so callers can skip them.
 */
export function getThemeValueByKey(theme: Theme, key: string): unknown {
  const [section, id, facet] = key.split(".")
  const themeObj = theme as unknown as Record<string, unknown>

  // Computed-section groups store every facet under `parameters[facet]`.
  if (COMPUTED_GROUP_KEYS.has(section)) {
    if (!id) return undefined
    const params = findInObject(themeObj, `${section}.parameters`)
    if (!isRecord(params)) return undefined
    const facetValue = params[id]
    // Font family slots keep the CSS stack under their own `parameters` string.
    if (
      section === "fontFamily" &&
      isRecord(facetValue) &&
      "parameters" in facetValue
    ) {
      return facetValue.parameters
    }
    return facetValue
  }

  if (section === "swatch") {
    // Swatch rows nest under a group: `swatch.<group>.<id>`. The trailing segment
    // is the swatch id. A bare group parent (`swatch.harmony`) has no value.
    // The swatch id may itself contain a dot, so read the two levels directly
    // instead of going through a dot-path lookup.
    const swatchId = key.split(".").slice(2).join(".")
    if (!swatchId) return undefined
    const swatchTable = themeObj["swatch"]
    const swatch = isRecord(swatchTable) ? swatchTable[swatchId] : undefined
    // Computed dynamic swatches expose a resolved top-level `value`. Custom
    // `TokenType.SWATCH` cells keep their color under `parameters.value`.
    if (isRecord(swatch)) {
      if ("value" in swatch) return swatch.value
      if (isRecord(swatch.parameters) && "value" in swatch.parameters) {
        return swatch.parameters.value
      }
    }
    return undefined
  }

  if (section === "fontWeight" && id) {
    const fontWeight = findInObject(themeObj, `fontWeight.${id}`)
    // Font weight cells are `EXACT`, with the numeric weight at `parameters.value`.
    if (isRecord(fontWeight) && isRecord(fontWeight.parameters)) {
      return fontWeight.parameters.value
    }
    return undefined
  }

  // Line height cells are `EXACT` with the value at `parameters.value`, even
  // though the schema keys them under a `.step` facet like the modulated scales.
  if (section === "lineHeight" && id && facet === "step") {
    const item = findInObject(themeObj, `${section}.${id}`)
    if (isRecord(item) && isRecord(item.parameters)) {
      return item.parameters.value
    }
    return undefined
  }

  if (MODULATION_STEP_SECTIONS.has(section) && id && facet === "step") {
    const item = findInObject(themeObj, `${section}.${id}`)
    if (isRecord(item) && isRecord(item.parameters)) {
      if ("step" in item.parameters) {
        return item.parameters.step
      }
      // An exact px/rem scale cell shows its length, e.g. "2px". Returning a
      // tagged EXACT value lets the value cell stringify it with its unit.
      if ("unit" in item.parameters && "value" in item.parameters) {
        return { type: ValueType.EXACT, value: item.parameters }
      }
    }
    return undefined
  }

  if (PARAMETER_SECTIONS.has(section) && id && facet) {
    const item = findInObject(themeObj, `${section}.${id}`)
    if (!isRecord(item) || !isRecord(item.parameters)) return undefined
    const params = item.parameters

    if (facet in params) return params[facet]
    // A look exposes every facet in its descriptor. Facets the look has not
    // authored read as EMPTY (unset) so their rows still render, matching the
    // built-in cleared look rather than being dropped as `undefined`.
    return { type: ValueType.EMPTY, value: null }
  }

  return undefined
}

/**
 * Tells whether the theme entry's own overrides contain a value for this row.
 * A swatch row only counts as overridden when its template theme also has the
 * swatch: a swatch added on the entry itself is that entry's base definition,
 * not an override, and resetting it would delete the swatch.
 */
export function isThemeKeyOverridden(
  key: string,
  overrides: EntryThemeOverrides,
  baseSwatchIds: ReadonlySet<string> | undefined,
): boolean {
  const path = getThemeOverridePath(key)
  if (!path) return false
  if (
    getOverrideAtPath(overrides as Record<string, unknown>, path) === undefined
  ) {
    return false
  }
  if (key.startsWith("swatch.")) {
    // Swatch rows nest under a group: `swatch.<group>.<id>`. The id is the last
    // segment.
    const swatchId = key.split(".").slice(2).join(".")
    return baseSwatchIds?.has(swatchId) ?? false
  }
  return true
}
