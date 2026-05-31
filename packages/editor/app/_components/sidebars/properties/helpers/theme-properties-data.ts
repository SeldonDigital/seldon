import { Theme } from "@seldon/core/themes/types"
import { ValueType } from "@seldon/core/properties"
import { getAllThemeTokenSchemas } from "@seldon/core/themes/schemas"
import type { ThemeTokenSchema } from "@seldon/core/themes/schemas"
import { FlatProperty } from "./properties-data"
import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import { themeSwatchToCssBackground } from "@seldon/core/helpers/color/theme-swatch-to-css-background"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import type { Value } from "@seldon/core/properties/types/value"
import type { ControlType } from "./properties-registry"

const VALUE_TYPES = new Set<unknown>(Object.values(ValueType))

/** `color.*` keys whose raw cell is a `{ value, unit }` shape shown as a plain number. */
const SCALAR_COLOR_KEYS = new Set([
  "angle",
  "step",
  "whitePoint",
  "grayPoint",
  "blackPoint",
  "bleed",
  "contrastRatio",
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
  "color.whitePoint": "white",
  "color.grayPoint": "gray",
  "color.blackPoint": "black",
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

/** Unwraps a `{ value, unit }` cell to its scalar; passes other values through. */
function unwrapUnit(value: unknown): unknown {
  if (isRecord(value) && "value" in value && "unit" in value) {
    return value.value
  }
  return value
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
 * - "core.ratio" -> theme.core.ratio
 * - "color.whitePoint" -> theme.color.whitePoint scalar
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

  if (section === "core") {
    if (id === "ratio") return theme.core.ratio
    if (id === "fontSize") return theme.core.fontSize
    if (id === "size") return theme.core.size
    return undefined
  }

  if (section === "color") {
    if (id === "baseColor") return theme.color.baseColor
    if (id === "harmony") return theme.color.harmony
    if (SCALAR_COLOR_KEYS.has(id)) {
      return unwrapUnit((theme.color as Record<string, unknown>)[id])
    }
    return undefined
  }

  if (section === "fontFamily" && id) {
    const family = getNestedValue(themeObj, ["fontFamily", id])
    if (isRecord(family)) {
      if ("parameters" in family) return family.parameters
      if ("value" in family) return family.value
    }
    return family
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
    if (isRecord(item) && isRecord(item.parameters) && "step" in item.parameters) {
      return item.parameters.step
    }
    return undefined
  }

  if (PARAMETER_SECTIONS.has(section) && id && facet) {
    const item = getNestedValue(themeObj, [section, id])
    if (!isRecord(item) || !isRecord(item.parameters)) return undefined
    const params = item.parameters

    if (section === "shadow") {
      if (facet === "offsetX" && isRecord(params.offset) && "x" in params.offset) {
        return params.offset.x
      }
      if (facet === "offsetY" && isRecord(params.offset) && "y" in params.offset) {
        return params.offset.y
      }
    }

    if (facet in params) return params[facet]
    return undefined
  }

  return undefined
}

/**
 * Creates a FlatProperty from a schema and theme value.
 */
function createFlatPropertyFromSchema(
  schema: ThemeTokenSchema,
  value: unknown,
  theme: Theme,
): FlatProperty {
  // Look parent rows only group their facets under a disclosure arrow. They have
  // no editable value and no control, so the value cell renders blank and no menu
  // chevron shows. The facets nested beneath remain individually editable.
  if (schema.isLookParent) {
    return {
      key: schema.key,
      propertyType: "compound",
      label: schema.label ?? schema.key,
      icon: schema.icon ?? "IconSeldonComponent",
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

  const isColorKey =
    schema.key === "color.baseColor" || schema.key.startsWith("swatch.")
  if (isColorKey && isHslObject(value)) {
    formattedValue = value
    actualValue = HSLObjectToString(value)
  }

  // Calculated swatches (white, gray, black, primary, swatch1-4) are read-only.
  const isCalculatedSwatch = CALCULATED_SWATCHES.has(schema.key)

  if (
    schema.controlType === "text" &&
    isRecord(value) &&
    !("hue" in value)
  ) {
    formattedValue = stringifyValue(value)
    actualValue = formattedValue as string
  }

  if (schema.key.includes("rounded") && typeof value === "boolean") {
    actualValue = value ? "On" : "Off"
  }

  // Color-filled icons for swatches and color points. Color-point swatches
  // already incorporate the bleed value; baseColor uses its HSL directly.
  let iconColorValue: string | undefined
  if (schema.key === "color.baseColor" && isHslObject(value)) {
    iconColorValue = HSLObjectToString(value)
  } else if (schema.key in COLOR_POINT_SWATCHES) {
    iconColorValue = themeSwatchToCssBackground(
      theme.swatch[COLOR_POINT_SWATCHES[schema.key]],
    )
  }

  const icon =
    schema.key.startsWith("swatch.") ||
    schema.key === "color.baseColor" ||
    schema.key in COLOR_POINT_SWATCHES
      ? "IconColorValue"
      : schema.icon ??
        (schema.key.endsWith(".step") ? "IconStepValue" : "IconSeldonComponent")

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
    status: "set",
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
 * @returns Array of FlatProperty objects representing theme values
 */
export function flattenThemeProperties(theme: Theme): FlatProperty[] {
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
    properties.push(createFlatPropertyFromSchema(schema, value, theme))
  }

  return properties
}
