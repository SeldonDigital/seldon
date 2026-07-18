import { getFamilyNameByValue } from "@seldon/core"
import { findInObject } from "@seldon/core/helpers"
import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import { themeSwatchToCssBackground } from "@seldon/core/helpers/color/theme-swatch-to-css-background"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import { getThemeValueName } from "@seldon/core/helpers/theme/get-theme-value-name"
import { ValueType } from "@seldon/core/properties"
import type { Value } from "@seldon/core/properties/types/value"
import { capitalize } from "@seldon/core/themes/helpers/capitalize"
import { getAllThemeTokenSchemas } from "@seldon/core/themes/schemas"
import type { ThemeTokenSchema } from "@seldon/core/themes/schemas"
import { THEME_TOKEN_SECTIONS } from "@seldon/core/themes/schemas"
import type { Theme } from "@seldon/core/themes/types"
import { getOverrideAtPath } from "@seldon/core/workspace/helpers/general/override-paths"
import { getThemeOverridePath } from "@seldon/core/workspace/helpers/themes/theme-override-paths"
import type { EntryThemeOverrides } from "@seldon/core/workspace/types"

const VALUE_TYPES = new Set<unknown>(Object.values(ValueType))

/** Top-level group keys in the Computed section; their facets read from `parameters`. */
const COMPUTED_GROUP_KEYS = new Set([
  "modulation",
  "colorHarmony",
  "displayMode",
  "fontFamily",
  "matchColor",
  "highContrast",
  "opticalPadding",
  "autoFit",
])

// Sections whose `.step` slot reads `parameters.step`. `lineHeight` has its own
// dedicated branch that handles every `lineHeight.*.step` key first.
const MODULATION_STEP_SECTIONS = new Set([
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
const PARAMETER_SECTIONS = new Set([
  "shadow",
  "border",
  "gradient",
  "background",
  "font",
  "scrollbar",
])

/** Read-only harmony swatch rows resolved from the theme's color computation. */
const CALCULATED_SWATCHES = new Set([
  "swatch.harmony.white",
  "swatch.harmony.gray",
  "swatch.harmony.black",
  "swatch.harmony.primary",
  "swatch.harmony.swatch1",
  "swatch.harmony.swatch2",
  "swatch.harmony.swatch3",
  "swatch.harmony.swatch4",
])

/** Color-point keys mapped to the computed swatch that fills their preview. */
const COLOR_POINT_SWATCHES: Record<string, "white" | "gray" | "black"> = {
  "colorHarmony.whitePoint": "white",
  "colorHarmony.grayPoint": "gray",
  "colorHarmony.blackPoint": "black",
}

const SECTION_LABELS = new Map(
  THEME_TOKEN_SECTIONS.map((section) => [section.id, section.label]),
)

type HslObject = { hue: number; saturation: number; lightness: number }

/** A single editable theme token, framework neutral. */
export type ThemeTokenControl =
  | { kind: "text"; value: string }
  | {
      kind: "option"
      value: string | number
      options: Array<{ label: string; value: string | number }>
    }
  | { kind: "readonly"; value: string }

export interface ThemeTokenRow {
  key: string
  label: string
  section: string
  sectionLabel: string
  order: number
  control: ThemeTokenControl
  isLookParent: boolean
  isSubProperty: boolean
  isOverridden: boolean
  isDimmed: boolean
  units?: string[]
  iconColorValue?: string
}

export interface ThemeTokenSectionRows {
  section: string
  label: string
  rows: ThemeTokenRow[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object"
}

function isHslObject(value: unknown): value is HslObject {
  return isRecord(value) && "hue" in value
}

/** Tells whether a raw theme value is already a property-style tagged value. */
function asTaggedValue(value: unknown): Value | null {
  if (isRecord(value) && "type" in value && VALUE_TYPES.has(value.type)) {
    return value as Value
  }
  return null
}

/** Resolves allowed unit suffixes for a numeric row from its token schema. */
function themeUnitsFromSchema(schema: ThemeTokenSchema): string[] | undefined {
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
 * - "swatch.primary" -> theme.swatch.primary.value
 * - "size.medium.step" -> theme.size.medium.parameters.step
 * - "shadow.moderate.offsetX" -> theme.shadow.moderate.parameters.offset.x
 *
 * Returns undefined for keys with no backing value so callers can skip them.
 */
function getThemeValueByKey(theme: Theme, key: string): unknown {
  const [section, id, facet] = key.split(".")
  const themeObj = theme as unknown as Record<string, unknown>

  if (COMPUTED_GROUP_KEYS.has(section)) {
    if (!id) return undefined
    const params = findInObject(themeObj, `${section}.parameters`)
    if (!isRecord(params)) return undefined
    const facetValue = params[id]
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
    const swatchId = key.split(".").slice(2).join(".")
    if (!swatchId) return undefined
    const swatchTable = themeObj["swatch"]
    const swatch = isRecord(swatchTable) ? swatchTable[swatchId] : undefined
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
    if (isRecord(fontWeight) && isRecord(fontWeight.parameters)) {
      return fontWeight.parameters.value
    }
    return undefined
  }

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
    return { type: ValueType.EMPTY, value: null }
  }

  return undefined
}

/** Tells whether the theme entry's own overrides contain a value for this row. */
function isThemeKeyOverridden(
  key: string,
  overrides: EntryThemeOverrides,
  baseSwatchIds: ReadonlySet<string> | undefined,
): boolean {
  const path = getThemeOverridePath(key)
  if (!path) return false
  if (getOverrideAtPath(overrides as Record<string, unknown>, path) === undefined) {
    return false
  }
  if (key.startsWith("swatch.")) {
    const swatchId = key.split(".").slice(2).join(".")
    return baseSwatchIds?.has(swatchId) ?? false
  }
  return true
}

/** Updates schema labels with actual names from the theme (modulation values). */
function labelForSchema(schema: ThemeTokenSchema, theme: Theme): string {
  if (schema.key.endsWith(".step")) {
    const [sectionKey, subKey] = schema.key.split(".")
    const section = (
      theme as unknown as Record<string, Record<string, { name?: string }>>
    )[sectionKey]
    if (section && section[subKey]?.name) return section[subKey].name as string
  }
  if (schema.key.startsWith("fontWeight.")) {
    const fontWeightKey = schema.key.split(".")[1]
    const fontWeight =
      theme.fontWeight[fontWeightKey as keyof typeof theme.fontWeight]
    if (fontWeight?.name) return fontWeight.name
  }
  return schema.label ?? schema.key
}

/** Builds the display control for a token row. */
function buildControl(
  schema: ThemeTokenSchema,
  value: unknown,
  theme: Theme,
): { control: ThemeTokenControl; isDimmed: boolean; iconColorValue?: string } {
  if (schema.isLookParent) {
    return { control: { kind: "readonly", value: "" }, isDimmed: false }
  }

  const isCalculatedSwatch = CALCULATED_SWATCHES.has(schema.key)

  let actualValue = String(value)
  const taggedValue = asTaggedValue(value)
  if (taggedValue) {
    actualValue = stringifyValue(taggedValue) ?? ""
    if (
      "type" in taggedValue &&
      (taggedValue.type === ValueType.THEME_CATEGORICAL ||
        taggedValue.type === ValueType.THEME_ORDINAL) &&
      "value" in taggedValue &&
      typeof taggedValue.value === "string" &&
      taggedValue.value.startsWith("@")
    ) {
      actualValue = getThemeValueName(taggedValue.value, theme)
    }
  }

  // Font slot options map the stored CSS token back to its friendly name.
  if (
    (schema.key === "fontFamily.primary" ||
      schema.key === "fontFamily.secondary") &&
    typeof value === "string"
  ) {
    actualValue = getFamilyNameByValue(value) ?? value
  }

  // A font look's family facet references a font slot, e.g. `@fontFamily.secondary`.
  const fontFamilyRefValue =
    taggedValue && "value" in taggedValue && typeof taggedValue.value === "string"
      ? taggedValue.value
      : typeof value === "string"
        ? value
        : null
  if (fontFamilyRefValue) {
    const slotMatch = /^@fontFamily\.(.+)$/.exec(fontFamilyRefValue)
    if (slotMatch) actualValue = `${capitalize(slotMatch[1]!)} Font`
  }

  const isColorKey =
    schema.key === "colorHarmony.baseColor" || schema.key.startsWith("swatch.")
  if (isColorKey && isHslObject(value)) {
    actualValue = HSLObjectToString(value)
  }

  if (schema.controlType === "text" && isRecord(value) && !("hue" in value)) {
    actualValue = stringifyValue(value as Value) ?? ""
  }

  if (typeof value === "boolean") {
    actualValue = value ? "On" : "Off"
  }

  if (typeof value === "number" && schema.unit && schema.unit.type !== "none") {
    actualValue = `${value}${schema.unit.type}`
  }

  let iconColorValue: string | undefined
  if (schema.key === "colorHarmony.baseColor" && isHslObject(value)) {
    iconColorValue = HSLObjectToString(value)
  } else if (schema.key in COLOR_POINT_SWATCHES) {
    iconColorValue = themeSwatchToCssBackground(
      theme.swatch[COLOR_POINT_SWATCHES[schema.key]],
    )
  } else if (isColorKey && typeof actualValue === "string" && actualValue) {
    iconColorValue = actualValue
  }

  if (isCalculatedSwatch) {
    return { control: { kind: "readonly", value: actualValue }, isDimmed: true, iconColorValue }
  }

  // Enumerated tokens (menu/combo) render as a select.
  if (
    (schema.controlType === "combo" || schema.controlType === "menu") &&
    schema.options &&
    schema.options.length > 0
  ) {
    const matching = schema.options.find(
      (option) => String(option.value) === String(value),
    )
    return {
      control: {
        kind: "option",
        value: matching ? matching.value : String(value),
        options: schema.options,
      },
      isDimmed: false,
      iconColorValue,
    }
  }

  // Booleans render as an On/Off select.
  if (schema.controlType === "boolean") {
    return {
      control: {
        kind: "option",
        value: value === true ? "true" : "false",
        options: [
          { label: "On", value: "true" },
          { label: "Off", value: "false" },
        ],
      },
      isDimmed: false,
      iconColorValue,
    }
  }

  return { control: { kind: "text", value: actualValue }, isDimmed: false, iconColorValue }
}

/**
 * Flattens a computed theme into editable token rows grouped by section. Mirrors
 * the React `flattenThemeProperties` read side but produces framework-neutral
 * rows, so both editors present the same theme token list.
 */
export function buildThemeTokenRows(
  theme: Theme,
  overrides?: EntryThemeOverrides,
  baseSwatchIds?: ReadonlySet<string>,
): ThemeTokenRow[] {
  const rows: ThemeTokenRow[] = []

  for (const schema of getAllThemeTokenSchemas(theme)) {
    const value = getThemeValueByKey(theme, schema.key)
    if (value === undefined && !schema.isLookParent) continue

    const { control, isDimmed, iconColorValue } = buildControl(
      schema,
      value,
      theme,
    )
    const isOverridden = overrides
      ? isThemeKeyOverridden(schema.key, overrides, baseSwatchIds)
      : false

    rows.push({
      key: schema.key,
      label: labelForSchema(schema, theme),
      section: schema.section,
      sectionLabel: SECTION_LABELS.get(schema.section) ?? schema.section,
      order: schema.order,
      control,
      isLookParent: schema.isLookParent ?? false,
      isSubProperty: schema.isSubProperty ?? false,
      isOverridden,
      isDimmed,
      units: themeUnitsFromSchema(schema),
      iconColorValue,
    })
  }

  return rows
}

/** Groups token rows into ordered sections for sidebar display. */
export function groupThemeTokenRows(
  rows: ThemeTokenRow[],
): ThemeTokenSectionRows[] {
  const bySection = new Map<string, ThemeTokenRow[]>()
  for (const row of rows) {
    const list = bySection.get(row.section) ?? []
    list.push(row)
    bySection.set(row.section, list)
  }

  const sections: ThemeTokenSectionRows[] = []
  for (const section of THEME_TOKEN_SECTIONS) {
    const list = bySection.get(section.id)
    if (!list || list.length === 0) continue
    sections.push({ section: section.id, label: section.label, rows: list })
  }
  return sections
}
