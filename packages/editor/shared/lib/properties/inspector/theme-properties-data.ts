import { type ControlType } from "@seldon/editor/lib/icons/icons-registry"
import {
  CALCULATED_SWATCHES,
  COLOR_POINT_SWATCHES,
  asTaggedValue,
  getThemeValueByKey,
  isHslObject,
  isRecord,
  isThemeKeyOverridden,
  themeUnitsFromSchema,
} from "@seldon/editor/lib/themes/theme-token-values"
import { getFamilyNameByValue } from "@seldon/core"
import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import { themeSwatchToCssBackground } from "@seldon/core/helpers/color/theme-swatch-to-css-background"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import { getThemeValueName } from "@seldon/core/helpers/theme/get-theme-value-name"
import { ValueType } from "@seldon/core/properties"
import { capitalize } from "@seldon/core/themes/helpers/capitalize"
import { getAllThemeTokenSchemas } from "@seldon/core/themes/schemas"
import type { ThemeTokenSchema } from "@seldon/core/themes/schemas"
import { Theme } from "@seldon/core/themes/types"
import type { EntryThemeOverrides } from "@seldon/core/workspace/types"
import { FlatProperty } from "./properties-data"

/** Maps schema control types to the subset supported by `FlatProperty`. */
const CONTROL_TYPE_MAP: Record<
  NonNullable<ThemeTokenSchema["controlType"]>,
  ControlType
> = {
  boolean: "menu",
  color: "text",
  number: "number",
  text: "text",
  combo: "combo",
  menu: "menu",
}

/**
 * Creates a FlatProperty from a schema and theme value.
 */
function createFlatPropertyFromSchema(
  schema: ThemeTokenSchema,
  value: unknown,
  theme: Theme,
  isOverridden: boolean,
): FlatProperty {
  // Look parent rows only group their facets under a disclosure arrow. They have
  // no editable value and no control, so the value cell renders blank and no menu
  // chevron shows. The facets nested beneath remain individually editable.
  if (schema.isLookParent) {
    return {
      key: schema.key,
      propertyType: "compound",
      label: schema.label ?? schema.key,
      icon: schema.icon ?? "seldon-component",
      value: { type: ValueType.EMPTY, value: null },
      actualValue: "",
      valueType: ValueType.EMPTY,
      controlType: undefined,
      isCompound: true,
      isShorthand: false,
      isSubProperty: false,
      isLookParent: true,
      status: "set",
    }
  }

  let formattedValue = value
  let actualValue = String(value)

  // Look-token parameters and other theme refs are already property-style tagged
  // values. Keep them as-is so the display/edit path treats them like normal
  // property values, instead of wrapping them in another EXACT value (which the
  // stringifier rejects, e.g. EXACT wrapping EMPTY).
  const taggedValue = asTaggedValue(value)
  if (taggedValue) {
    actualValue = stringifyValue(taggedValue) ?? ""
    // Theme token references show their friendly name (e.g. `@swatch.white` ->
    // "White", `@fontWeight.medium` -> "Medium") instead of the raw token. The
    // fontFamily special cases below override this with the slot name.
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

  if (
    (schema.controlType === "combo" || schema.controlType === "menu") &&
    schema.options &&
    schema.options.length > 0
  ) {
    const valueString = String(value)
    const matchingOption = schema.options.find(
      (opt) => String(opt.value) === valueString,
    )
    if (matchingOption) {
      actualValue = matchingOption.label
    }
  }

  // Font slot options come from the workspace at the picker layer, so they are not
  // on the static schema. Map the stored CSS token back to its friendly family name.
  if (
    (schema.key === "fontFamily.primary" ||
      schema.key === "fontFamily.secondary") &&
    typeof value === "string"
  ) {
    actualValue = getFamilyNameByValue(value) ?? value
  }

  // A font look's family facet references a font slot, e.g. `@fontFamily.secondary`.
  // Show the slot's friendly name ("Secondary Font") instead of the raw token.
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
    if (slotMatch) {
      const slot = slotMatch[1]!
      actualValue = `${capitalize(slot)} Font`
    }
  }

  const isColorKey =
    schema.key === "colorHarmony.baseColor" || schema.key.startsWith("swatch.")
  if (isColorKey && isHslObject(value)) {
    actualValue = HSLObjectToString(value)
  }

  // Calculated swatches (white, gray, black, primary, swatch1-4) are read-only.
  const isCalculatedSwatch = CALCULATED_SWATCHES.has(schema.key)

  if (schema.controlType === "text" && isRecord(value) && !("hue" in value)) {
    formattedValue = stringifyValue(value)
    actualValue = formattedValue as string
  }

  if (typeof value === "boolean") {
    actualValue = value ? "On" : "Off"
  }

  // A bare numeric facet that declares a display unit folds it into the value so
  // the row renders and edits as `10%`, `24deg`, or `16px`, the same way a
  // dimension value renders. Unitless facets (`none`) stay plain numbers, and
  // values that already carry their unit (exact lengths, look facets) are left
  // untouched above. The commit path strips the suffix back to a number.
  if (typeof value === "number" && schema.unit && schema.unit.type !== "none") {
    formattedValue = { unit: schema.unit.type, value }
    actualValue = `${value}${schema.unit.type}`
  }

  // Color-filled icons for swatches and color points. Color-point swatches
  // already incorporate the bleed value; baseColor uses its HSL directly.
  let iconColorValue: string | undefined
  if (schema.key === "colorHarmony.baseColor" && isHslObject(value)) {
    iconColorValue = HSLObjectToString(value)
  } else if (schema.key in COLOR_POINT_SWATCHES) {
    iconColorValue = themeSwatchToCssBackground(
      theme.swatch[COLOR_POINT_SWATCHES[schema.key]],
    )
  }

  const icon =
    schema.key.startsWith("swatch.") ||
    schema.key === "colorHarmony.baseColor" ||
    schema.key in COLOR_POINT_SWATCHES
      ? "icon-custom-color-value"
      : (schema.icon ?? "seldon-component")

  const controlType = schema.controlType
    ? CONTROL_TYPE_MAP[schema.controlType]
    : undefined

  const flatProperty: FlatProperty = {
    key: schema.key,
    propertyType: "atomic",
    label: schema.label ?? schema.key,
    icon,
    value: taggedValue ?? { type: ValueType.EXACT, value: formattedValue },
    actualValue,
    valueType: taggedValue
      ? (taggedValue as { type: ValueType }).type
      : ValueType.EXACT,
    controlType,
    isCompound: false,
    isShorthand: false,
    isSubProperty: schema.isSubProperty ?? false,
    status: isOverridden ? "override" : "set",
    isDimmed: isCalculatedSwatch,
  }

  if (iconColorValue) {
    flatProperty.iconColorValue = iconColorValue
  }

  const units = themeUnitsFromSchema(schema)
  if (units) {
    flatProperty.units = units
  }

  return flatProperty
}

/**
 * Updates schema labels with actual names from theme (for modulation values).
 */
function updateSchemaLabelsWithThemeNames(
  schemas: ThemeTokenSchema[],
  theme: Theme,
): ThemeTokenSchema[] {
  return schemas.map((schema) => {
    if (schema.key.endsWith(".step")) {
      const [sectionKey, subKey] = schema.key.split(".")
      const section = (
        theme as unknown as Record<string, Record<string, { name: string }>>
      )[sectionKey]
      if (section && section[subKey]?.name) {
        return { ...schema, label: section[subKey].name }
      }
    }

    if (schema.key.startsWith("fontWeight.")) {
      const fontWeightKey = schema.key.split(".")[1]
      const fontWeight =
        theme.fontWeight[fontWeightKey as keyof typeof theme.fontWeight]
      if (fontWeight?.name) {
        return { ...schema, label: fontWeight.name }
      }
    }

    return schema
  })
}

/**
 * Transforms theme structure into flat properties format compatible with PropertyTree.
 * Uses schema system to determine labels, control types, and ordering.
 *
 * @param theme - The theme to transform
 * @param overrides - The theme entry's own overrides, used to mark rows as overridden
 * @param baseSwatchIds - Swatch ids defined by the entry's template theme
 * @returns Array of FlatProperty objects representing theme values
 */
export function flattenThemeProperties(
  theme: Theme,
  overrides?: EntryThemeOverrides,
  baseSwatchIds?: ReadonlySet<string>,
): FlatProperty[] {
  const properties: FlatProperty[] = []

  const schemasWithLabels = updateSchemaLabelsWithThemeNames(
    getAllThemeTokenSchemas(theme),
    theme,
  )

  for (const schema of schemasWithLabels) {
    const value = getThemeValueByKey(theme, schema.key)
    // Look parent rows have no backing value of their own; they exist to group
    // their facet rows under a disclosure arrow, so always keep them.
    if (value === undefined && !schema.isLookParent) {
      continue
    }
    const isOverridden = overrides
      ? isThemeKeyOverridden(schema.key, overrides, baseSwatchIds)
      : false
    properties.push(
      createFlatPropertyFromSchema(schema, value, theme, isOverridden),
    )
  }

  return properties
}
