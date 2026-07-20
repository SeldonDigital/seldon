import { getFamilyNameByValue } from "@seldon/core"
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
import type { EntryThemeOverrides } from "@seldon/core/workspace/types"
import {
  CALCULATED_SWATCHES,
  COLOR_POINT_SWATCHES,
  asTaggedValue,
  getThemeValueByKey,
  isHslObject,
  isRecord,
  isThemeKeyOverridden,
  themeUnitsFromSchema,
} from "./theme-token-values"

const SECTION_LABELS = new Map(
  THEME_TOKEN_SECTIONS.map((section) => [section.id, section.label]),
)

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
    taggedValue &&
    "value" in taggedValue &&
    typeof taggedValue.value === "string"
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
    return {
      control: { kind: "readonly", value: actualValue },
      isDimmed: true,
      iconColorValue,
    }
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

  return {
    control: { kind: "text", value: actualValue },
    isDimmed: false,
    iconColorValue,
  }
}

/**
 * Flattens a computed theme into editable token rows grouped by section. Shares
 * the read side ({@link getThemeValueByKey}, {@link isThemeKeyOverridden}) with
 * the React `flattenThemeProperties` builder, then shapes framework-neutral rows
 * so both editors present the same theme token list.
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
