import type { ControlType } from "@lib/icons/icons-registry"
import { getFamilyNameByValue } from "@seldon/core"
import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import { themeSwatchToCssBackground } from "@seldon/core/helpers/color/theme-swatch-to-css-background"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import { ValueType } from "@seldon/core/properties"
import type { Value } from "@seldon/core/properties/types/value"
import { getAllThemeTokenSchemas } from "@seldon/core/themes/schemas"
import type { ThemeTokenSchema } from "@seldon/core/themes/schemas"
import { Theme } from "@seldon/core/themes/types"
import {
  getOverrideAtPath,
  getThemeOverridePath,
} from "@seldon/core/workspace/helpers/themes/theme-override-paths"
import type { EntryThemeOverrides } from "@seldon/core/workspace/types"
import { FlatProperty } from "./properties-data"

const VALUE_TYPES = new Set<unknown>(Object.values(ValueType))

/** Top-level group keys in the Computed section; their facets read from `parameters`. */
const COMPUTED_GROUP_KEYS = new Set([
  "modulation",
  "colorHarmony",
  "fontFamily",
  "matchColor",
  "highContrast",
  "opticalPadding",
  "autoFit",
])

/** Sections whose `.step` slot reads `parameters.step`. `spread` is intentionally excluded. */
const MODULATION_STEP_SECTIONS = new Set([
  "size",
  "dimension",
  "margin",
  "padding",
  "gap",
  "fontSize",
  "lineHeight",
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

/** Read-only swatch slots resolved from the theme's color computation. */
const CALCULATED_SWATCHES = new Set([
  "swatch.white",
  "swatch.gray",
  "swatch.black",
  "swatch.primary",
  "swatch.swatch1",
  "swatch.swatch2",
  "swatch.swatch3",
  "swatch.swatch4",
])

/** Color-point keys mapped to the computed swatch that fills their icon. */
const COLOR_POINT_SWATCHES: Record<string, "white" | "gray" | "black"> = {
  "colorHarmony.whitePoint": "white",
  "colorHarmony.grayPoint": "gray",
  "colorHarmony.blackPoint": "black",
}

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

type HslObject = { hue: number; saturation: number; lightness: number }

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

/** Safely reads a nested object value by path, returning undefined on any miss. */
function getNestedValue(obj: unknown, path: string[]): unknown {
  let current: unknown = obj
  for (const key of path) {
    if (!isRecord(current) || !(key in current)) {
      return undefined
    }
    current = current[key]
  }
  return current
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
function getThemeValueByKey(theme: Theme, key: string): unknown {
  const [section, id, facet] = key.split(".")
  const themeObj = theme as unknown as Record<string, unknown>

  // Computed-section groups store every facet under `parameters[facet]`.
  if (COMPUTED_GROUP_KEYS.has(section)) {
    if (!id) return undefined
    const params = getNestedValue(themeObj, [section, "parameters"])
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

  if (section === "swatch" && id) {
    const swatch = getNestedValue(themeObj, ["swatch", id])
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
    const fontWeight = getNestedValue(themeObj, ["fontWeight", id])
    // Font weight cells are `EXACT`, with the numeric weight at `parameters.value`.
    if (isRecord(fontWeight) && isRecord(fontWeight.parameters)) {
      return fontWeight.parameters.value
    }
    return undefined
  }

  // Line height cells are `EXACT` with the value at `parameters.value`, even
  // though the schema keys them under a `.step` facet like the modulated scales.
  if (section === "lineHeight" && id && facet === "step") {
    const item = getNestedValue(themeObj, [section, id])
    if (isRecord(item) && isRecord(item.parameters)) {
      return item.parameters.value
    }
    return undefined
  }

  if (MODULATION_STEP_SECTIONS.has(section) && id && facet === "step") {
    const item = getNestedValue(themeObj, [section, id])
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
    const item = getNestedValue(themeObj, [section, id])
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
function isThemeKeyOverridden(
  key: string,
  overrides: EntryThemeOverrides,
  baseSwatchIds: ReadonlySet<string> | undefined,
): boolean {
  const path = getThemeOverridePath(key)
  if (!path) return false
  if (getOverrideAtPath(overrides, path) === undefined) return false
  if (key.startsWith("swatch.")) {
    const swatchId = key.split(".")[1]
    return baseSwatchIds?.has(swatchId) ?? false
  }
  return true
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

  const isColorKey =
    schema.key === "colorHarmony.baseColor" ||
    schema.key.startsWith("swatch.")
  if (isColorKey && isHslObject(value)) {
    formattedValue = value
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
      : (schema.icon ??
        (schema.key.endsWith(".step") ? "seldon-step" : "seldon-component"))

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
