import {
  Align,
  BorderCollapse,
  BorderStyle,
  BorderWidth,
  Color,
  ComputedFunction,
  Corner,
  Cursor,
  DegreesValue,
  Direction,
  Display,
  FontStyle,
  Gap,
  GradientType,
  HtmlElement,
  ImageFit,
  InputType,
  NumberValue,
  Orientation,
  PercentageValue,
  PixelValue,
  RemValue,
  Resize,
  ScreenSize,
  Scroll,
  ScrollbarStyle,
  TextAlign,
  TextDecoration,
  ThemeBackgroundKey,
  ThemeBlurKey,
  ThemeBorderKey,
  ThemeBorderWidthKey,
  ThemeCornersKey,
  ThemeDimensionKey,
  ThemeFontFamilyKey,
  ThemeFontKey,
  ThemeFontSizeKey,
  ThemeFontWeightKey,
  ThemeGapKey,
  ThemeGradientKey,
  ThemeLineHeightKey,
  ThemeMarginKey,
  ThemePaddingKey,
  ThemeSection,
  ThemeShadowKey,
  ThemeSizeKey,
  ThemeSpreadKey,
  ThemeSwatchKey,
  Unit,
  Value,
  ValueType,
} from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { isDoubleAxisValue } from "@seldon/core/helpers/type-guards/value/is-double-axis-value"
import {
  isNumber,
  isPercentage,
  isPx,
  isRem,
  isThemeValueKey,
} from "@seldon/core/helpers/validation"
import { getDefaultUnitForProperty as getDefaultUnitForPropertyCore } from "@seldon/core/properties/helpers/unit-utils"
import {
  getCompoundSubPropertySchema,
  getPropertySchema,
} from "@seldon/core/properties/schemas/helpers"
import { Board, Instance, Variant } from "@seldon/core/workspace/types"
import { serializeColor } from "./serialize-color"

/**
 * Dynamic preset mapping system that automatically handles all preset values.
 * This eliminates the need for individual if statements for each preset.
 */
const PRESET_MAPPINGS = new Map<string, string>()

// Initialize the preset mappings
function initializePresetMappings() {
  // Gap presets
  Object.entries(Gap).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, Gap[key as keyof typeof Gap])
  })

  // Resize presets
  Object.entries(Resize).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, Resize[key as keyof typeof Resize])
  })

  // Screen size presets
  Object.entries(ScreenSize).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, ScreenSize[key as keyof typeof ScreenSize])
  })

  // Orientation presets
  Object.entries(Orientation).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, Orientation[key as keyof typeof Orientation])
  })

  // HTML element presets
  Object.entries(HtmlElement).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, HtmlElement[key as keyof typeof HtmlElement])
  })

  // Align presets
  Object.entries(Align).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, Align[key as keyof typeof Align])
  })

  // Border presets
  Object.entries(BorderStyle).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, BorderStyle[key as keyof typeof BorderStyle])
  })
  Object.entries(BorderWidth).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, BorderWidth[key as keyof typeof BorderWidth])
  })
  Object.entries(BorderCollapse).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(
      value,
      BorderCollapse[key as keyof typeof BorderCollapse],
    )
  })

  // Color presets
  Object.entries(Color).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, Color[key as keyof typeof Color])
  })

  // Corner presets
  Object.entries(Corner).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, Corner[key as keyof typeof Corner])
  })

  // Cursor presets
  Object.entries(Cursor).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, Cursor[key as keyof typeof Cursor])
  })

  // Direction presets
  Object.entries(Direction).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, Direction[key as keyof typeof Direction])
  })

  // Display presets
  Object.entries(Display).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, Display[key as keyof typeof Display])
  })

  // Font presets
  Object.entries(FontStyle).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, FontStyle[key as keyof typeof FontStyle])
  })

  // Gradient presets
  Object.entries(GradientType).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, GradientType[key as keyof typeof GradientType])
  })

  // Image fit presets
  Object.entries(ImageFit).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, ImageFit[key as keyof typeof ImageFit])
  })

  // Input type presets
  Object.entries(InputType).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, InputType[key as keyof typeof InputType])
  })

  // Scroll presets
  Object.entries(Scroll).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, Scroll[key as keyof typeof Scroll])
  })
  Object.entries(ScrollbarStyle).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(
      value,
      ScrollbarStyle[key as keyof typeof ScrollbarStyle],
    )
  })

  // Text presets
  Object.entries(TextAlign).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(value, TextAlign[key as keyof typeof TextAlign])
  })
  Object.entries(TextDecoration).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(
      value,
      TextDecoration[key as keyof typeof TextDecoration],
    )
  })

  // Computed function presets
  Object.entries(ComputedFunction).forEach(([key, value]) => {
    PRESET_MAPPINGS.set(
      value,
      ComputedFunction[key as keyof typeof ComputedFunction],
    )
  })
}

// Initialize the mappings
initializePresetMappings()

/**
 * Checks if a value is a known preset and returns the appropriate Value object.
 */
function tryPresetValue(value: string): Value | null {
  const presetValue = PRESET_MAPPINGS.get(value)
  if (presetValue !== undefined) {
    return { type: ValueType.PRESET, value: presetValue }
  }
  return null
}

/**
 * Get default unit for a property based on its name
 * Uses the core properties system for authoritative unit information
 */
function getDefaultUnitForProperty(propertyKey: string): Unit {
  return getDefaultUnitForPropertyCore(propertyKey)
}

/**
 * Check if a property key is a color-related property
 * Uses the core properties system for authoritative color property detection
 */
export function isColorProperty(propertyKey: string): boolean {
  // Handle sub-properties by checking the full path
  const actualProperty = propertyKey.includes(".")
    ? propertyKey.split(".").pop()!
    : propertyKey

  // Try direct property first
  let schema = getPropertySchema(actualProperty)

  // If not found, try compound property (e.g., "background.color")
  if (!schema && propertyKey.includes(".")) {
    const [parent, sub] = propertyKey.split(".")
    schema = getCompoundSubPropertySchema(parent, sub)
  }

  if (!schema) return false

  // Check if the property supports themeCategorical (color theme values)
  // This is the most reliable indicator of color properties
  return (
    schema.supports.includes("themeCategorical") &&
    schema.themeCategoricalKeys !== undefined
  )
}

/**
 * Get the appropriate unit for a numeric value based on context
 */
function getUnitForNumericValue(
  currentValue: Value | undefined,
  node?: Variant | Instance | Board,
  propertyKey?: string,
): Unit {
  if (
    currentValue &&
    "type" in currentValue &&
    currentValue.type === ValueType.EXACT &&
    typeof currentValue.value === "object" &&
    "unit" in currentValue.value
  ) {
    return currentValue.value.unit
  }

  if (node && !("isBoard" in node) && "component" in node && propertyKey) {
    const schema = getComponentSchema(node.component)
    if (schema?.properties) {
      const schemaProperty = (schema.properties as Record<string, Value>)[
        propertyKey
      ]
      if (
        schemaProperty &&
        "type" in schemaProperty &&
        schemaProperty.type === ValueType.EXACT &&
        typeof schemaProperty.value === "object" &&
        "unit" in schemaProperty.value
      ) {
        return schemaProperty.value.unit
      }
    }
  }

  return getDefaultUnitForProperty(propertyKey || "")
}

/**
 * Serializes a string to a PropertyValue object.
 *
 * @param value - The value to serialize.
 * @param options - Options for serialization including current value and default unit.
 * @param node - Optional node context for property-aware unit detection.
 * @param propertyKey - Optional property key for property-aware unit detection.
 * @returns The serialized PropertyValue object.
 * @throws A TypeError if the value cannot be serialized.
 */
export function serializeValue(
  value: string,
  options?: { currentValue?: Value; defaultUnit?: Unit },
  node?: Variant | Instance | Board,
  propertyKey?: string,
): Value {
  if (value === "" || value == "none" || value === "default") {
    return { type: ValueType.EMPTY, value: null }
  }

  // Try to handle as a preset value using the dynamic mapping system
  const presetValue = tryPresetValue(value)
  if (presetValue) {
    return presetValue
  }

  if (isDoubleAxisValue(value)) {
    const [x, y] = value.trim().split(" ")

    return {
      type: ValueType.EXACT,
      value: {
        x: (serializeValue(x, options) as PixelValue).value,
        y: (serializeValue(y, options) as PixelValue).value,
      },
    }
  }

  // TODO: Fix this by adding theme metadata
  if (isThemeValueKey(value)) {
    const themeSection = value.split(".")[0] as `@${ThemeSection}`
    switch (themeSection) {
      case "@border":
        return {
          type: ValueType.THEME_CATEGORICAL,
          value: value as ThemeBorderKey,
        }

      case "@borderWidth":
        return {
          type: ValueType.THEME_ORDINAL,
          value: value as ThemeBorderWidthKey,
        }

      case "@blur":
        return { type: ValueType.THEME_ORDINAL, value: value as ThemeBlurKey }

      case "@corners":
        return {
          type: ValueType.THEME_ORDINAL,
          value: value as ThemeCornersKey,
        }

      case "@font":
        return {
          type: ValueType.THEME_CATEGORICAL,
          value: value as ThemeFontKey,
        }

      case "@fontSize":
        return {
          type: ValueType.THEME_ORDINAL,
          value: value as ThemeFontSizeKey,
        }

      case "@fontWeight":
        return {
          type: ValueType.THEME_ORDINAL,
          value: value as ThemeFontWeightKey,
        }

      case "@lineHeight":
        return {
          type: ValueType.THEME_ORDINAL,
          value: value as ThemeLineHeightKey,
        }

      case "@size":
        return { type: ValueType.THEME_ORDINAL, value: value as ThemeSizeKey }

      case "@lineHeight":
        return {
          type: ValueType.THEME_ORDINAL,
          value: value as ThemeLineHeightKey,
        }

      case "@margin":
        return { type: ValueType.THEME_ORDINAL, value: value as ThemeMarginKey }

      case "@padding":
        return {
          type: ValueType.THEME_ORDINAL,
          value: value as ThemePaddingKey,
        }

      case "@gap":
        return { type: ValueType.THEME_ORDINAL, value: value as ThemeGapKey }

      case "@size":
        return { type: ValueType.THEME_ORDINAL, value: value as ThemeSizeKey }

      case "@dimension":
        return {
          type: ValueType.THEME_ORDINAL,
          value: value as ThemeDimensionKey,
        }

      case "@swatch":
        return {
          type: ValueType.THEME_CATEGORICAL,
          value: value as ThemeSwatchKey,
        }
      case "@shadow":
        return {
          type: ValueType.THEME_CATEGORICAL,
          value: value as ThemeShadowKey,
        }
      case "@spread":
        return { type: ValueType.THEME_ORDINAL, value: value as ThemeSpreadKey }
      case "@gradient":
        return {
          type: ValueType.THEME_CATEGORICAL,
          value: value as ThemeGradientKey,
        }

      case "@background":
        return {
          type: ValueType.THEME_CATEGORICAL,
          value: value as ThemeBackgroundKey,
        }

      case "@color":
        return {
          type: ValueType.THEME_CATEGORICAL,
          value: value as ThemeSwatchKey,
        }

      case "@fontFamily":
        return {
          type: ValueType.THEME_CATEGORICAL,
          value: value as ThemeFontFamilyKey,
        }

      case "@fontWeight":
        return {
          type: ValueType.THEME_ORDINAL,
          value: value as ThemeFontWeightKey,
        }

      default:
        throw new TypeError("Unknown theme section " + themeSection)
    }
  }

  if (isPx(value)) {
    return {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: parseFloat(value) },
    }
  }

  if (isRem(value)) {
    return {
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: parseFloat(value) },
    }
  }

  if (isPercentage(value)) {
    return {
      type: ValueType.EXACT,
      value: { unit: Unit.PERCENT, value: parseFloat(value) },
    }
  }

  // Handle icon values (symbol property)
  if (
    propertyKey === "symbol" &&
    (value.startsWith("material-") ||
      value.startsWith("seldon-") ||
      value.startsWith("social-") ||
      value === "__default__" ||
      value === "missing")
  ) {
    return { type: ValueType.PRESET, value }
  }

  if (isNumber(value)) {
    // Determine the unit to use
    let unit: Unit

    // First check if current value has a unit (highest priority)
    if (
      options?.currentValue &&
      "type" in options.currentValue &&
      options.currentValue.type === ValueType.EXACT &&
      typeof options.currentValue.value === "object" &&
      "unit" in options.currentValue.value
    ) {
      unit = options.currentValue.value.unit
    } else if (options?.defaultUnit) {
      // Use provided default unit
      unit = options.defaultUnit
    } else {
      // Use the enhanced unit detection that considers node and property context
      unit = getUnitForNumericValue(options?.currentValue, node, propertyKey)
    }

    if (unit === Unit.DEGREES) {
      return {
        type: ValueType.EXACT,
        value: { unit, value: parseFloat(value) % 360 },
      }
    }

    return {
      type: ValueType.EXACT,
      value: { unit, value: parseFloat(value) },
    } as ValueWithUnit
  }

  // Handle color values for color-related properties
  if (propertyKey && isColorProperty(propertyKey)) {
    try {
      return serializeColor(value)
    } catch (error) {
      // If color serialization fails, store as invalid string value
      // This allows invalid colors to be stored and displayed in error state
      return {
        type: ValueType.EXACT,
        value: value,
      }
    }
  }

  // Handle simple string values (like content, placeholder, etc.)
  return {
    type: ValueType.EXACT,
    value: value,
  }
}

type ValueWithUnit =
  | PixelValue
  | RemValue
  | PercentageValue
  | DegreesValue
  | NumberValue
