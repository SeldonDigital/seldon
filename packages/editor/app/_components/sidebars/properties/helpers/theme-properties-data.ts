import { Theme } from "@seldon/core/themes/types"
import { ValueType } from "@seldon/core/properties"
import {
  getAllThemeTokenSchemas,
  getThemeTokenSchema,
} from "@seldon/core/themes/schemas"
import { FlatProperty } from "./properties-data"
import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import { themeSwatchToCssBackground } from "@seldon/core/helpers/color/theme-swatch-to-css-background"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import type { HSL } from "@seldon/core/properties/values/shared/exact/hsl"

/**
 * Generic helper to safely access nested object properties
 */
function getNestedValue(obj: unknown, path: string[]): unknown {
  let current: unknown = obj
  for (const key of path) {
    if (current == null || typeof current !== "object") {
      return undefined
    }
    const record = current as Record<string, unknown>
    if (!(key in record)) {
      return undefined
    }
    current = record[key]
  }
  return current
}

/**
 * Gets a value from theme object using a dot-notation key path
 * Handles nested paths like:
 * - "core.ratio" -> theme.core.ratio
 * - "color.baseColor" -> theme.color.baseColor
 * - "swatch.primary" -> theme.swatch.primary.value
 * - "size.medium.step" -> theme.size.medium.parameters.step
 * - "shadow.xlight.offsetX" -> theme.shadow.xlight.parameters.offset.x
 * - "border.hairline.width" -> theme.border.hairline.parameters.width
 */
function getThemeValueByKey(theme: Theme, key: string): unknown {
  const parts = key.split(".")
  const themeObj = theme as unknown as Record<string, unknown>
  
  // Handle core properties
  if (parts[0] === "core") {
    if (parts[1] === "ratio") return theme.core.ratio
    if (parts[1] === "fontSize") return theme.core.fontSize
    if (parts[1] === "size") return theme.core.size
  }

  // Handle color properties
  if (parts[0] === "color") {
    if (parts[1] === "baseColor") return theme.color.baseColor
    if (parts[1] === "harmony") return theme.color.harmony
    if (parts[1] === "angle") {
      const value = theme.color.angle
      // Normalize unit objects to plain numbers for theme properties
      if (value && typeof value === "object" && "value" in value && "unit" in value) {
        return (value as { value: number }).value
      }
      return value
    }
    if (parts[1] === "step") {
      const value = theme.color.step
      if (value && typeof value === "object" && "value" in value && "unit" in value) {
        return (value as { value: number }).value
      }
      return value
    }
    if (parts[1] === "whitePoint") {
      const value = theme.color.whitePoint
      // Normalize unit objects to plain numbers for theme properties
      if (value && typeof value === "object" && "value" in value && "unit" in value) {
        return (value as { value: number }).value
      }
      return value
    }
    if (parts[1] === "grayPoint") {
      const value = theme.color.grayPoint
      // Normalize unit objects to plain numbers for theme properties
      if (value && typeof value === "object" && "value" in value && "unit" in value) {
        return (value as { value: number }).value
      }
      return value
    }
    if (parts[1] === "blackPoint") {
      const value = theme.color.blackPoint
      // Normalize unit objects to plain numbers for theme properties
      if (value && typeof value === "object" && "value" in value && "unit" in value) {
        return (value as { value: number }).value
      }
      return value
    }
    if (parts[1] === "bleed") {
      const value = theme.color.bleed
      if (value && typeof value === "object" && "value" in value && "unit" in value) {
        return (value as { value: number }).value
      }
      return value
    }
    if (parts[1] === "contrastRatio") {
      const value = theme.color.contrastRatio
      if (value && typeof value === "object" && "value" in value && "unit" in value) {
        return (value as { value: number }).value
      }
      return value
    }
  }

  // Handle fontFamily properties
  if (parts[0] === "fontFamily") {
    if (parts[1] === "primary") return theme.fontFamily.primary
    if (parts[1] === "secondary") return theme.fontFamily.secondary
  }

  // Handle swatch properties (swatch.{id} -> value)
  if (parts[0] === "swatch" && parts[1]) {
    // Use generic access pattern that works with custom swatches
    const swatchSection = getNestedValue(themeObj, ["swatch"])
    if (swatchSection && typeof swatchSection === "object") {
      const swatch = (swatchSection as Record<string, unknown>)[parts[1]]
      if (swatch && typeof swatch === "object" && "value" in swatch) {
        return (swatch as { value: unknown }).value
      }
    }
  }

  // Handle modulation value properties (section.{id}.step -> parameters.step)
  const modulationSections = ["size", "dimension", "margin", "padding", "gap", "fontSize", "lineHeight", "borderWidth", "corners", "blur"]
  if (modulationSections.includes(parts[0]) && parts[1] && parts[2] === "step") {
    const item = getNestedValue(themeObj, [parts[0], parts[1]])
    if (item && typeof item === "object" && "parameters" in item) {
      const params = (item as { parameters?: { step?: unknown } }).parameters
      if (params && typeof params === "object" && "step" in params) {
        return params.step
      }
    }
  }

  // Handle fontWeight properties (fontWeight.{id} -> value)
  if (parts[0] === "fontWeight" && parts[1]) {
    const fontWeight = getNestedValue(themeObj, ["fontWeight", parts[1]])
    if (fontWeight && typeof fontWeight === "object" && "value" in fontWeight) {
      return (fontWeight as { value: unknown }).value
    }
  }

  // Handle shadow properties (shadow.{id}.{property} -> parameters.{property})
  if (parts[0] === "shadow" && parts[1] && parts[2]) {
    const shadowSection = getNestedValue(themeObj, ["shadow"])
    if (shadowSection && typeof shadowSection === "object") {
      const shadow = (shadowSection as Record<string, unknown>)[parts[1]]
      if (shadow && typeof shadow === "object" && "parameters" in shadow) {
        const params = (shadow as { parameters?: Record<string, unknown> }).parameters
        if (params && typeof params === "object") {
          if (parts[2] === "offsetX" && params.offset && typeof params.offset === "object" && "x" in params.offset) {
            return (params.offset as { x: unknown }).x
          }
          if (parts[2] === "offsetY" && params.offset && typeof params.offset === "object" && "y" in params.offset) {
            return (params.offset as { y: unknown }).y
          }
          if (parts[2] in params) {
            return params[parts[2]]
          }
        }
      }
    }
  }

  // Handle border properties (border.{id}.{property} -> parameters.{property})
  if (parts[0] === "border" && parts[1] && parts[2]) {
    const borderSection = getNestedValue(themeObj, ["border"])
    if (borderSection && typeof borderSection === "object") {
      const border = (borderSection as Record<string, unknown>)[parts[1]]
      if (border && typeof border === "object" && "parameters" in border) {
        const params = (border as { parameters?: Record<string, unknown> }).parameters
        if (params && typeof params === "object" && parts[2] in params) {
          return params[parts[2]]
        }
      }
    }
  }

  // Handle gradient properties (gradient.{id}.{property} -> parameters.{property})
  if (parts[0] === "gradient" && parts[1] && parts[2]) {
    const gradientSection = getNestedValue(themeObj, ["gradient"])
    if (gradientSection && typeof gradientSection === "object") {
      const gradient = (gradientSection as Record<string, unknown>)[parts[1]]
      if (gradient && typeof gradient === "object" && "parameters" in gradient) {
        const params = (gradient as { parameters?: Record<string, unknown> }).parameters
        if (params && typeof params === "object" && parts[2] in params) {
          return params[parts[2]]
        }
      }
    }
  }

  // Handle background properties (background.{id}.color -> parameters.color)
  if (parts[0] === "background" && parts[1] && parts[2] === "color") {
    const backgroundSection = getNestedValue(themeObj, ["background"])
    if (backgroundSection && typeof backgroundSection === "object") {
      const background = (backgroundSection as Record<string, unknown>)[parts[1]]
      if (background && typeof background === "object" && "parameters" in background) {
        const params = (background as { parameters?: { color?: unknown } }).parameters
        if (params && typeof params === "object" && "color" in params) {
          return params.color
        }
      }
    }
  }

  // Handle font properties (font.{id}.{property} -> parameters.{property})
  if (parts[0] === "font" && parts[1] && parts[2]) {
    const fontSection = getNestedValue(themeObj, ["font"])
    if (fontSection && typeof fontSection === "object") {
      const font = (fontSection as Record<string, unknown>)[parts[1]]
      if (font && typeof font === "object" && "parameters" in font) {
        const params = (font as { parameters?: Record<string, unknown> }).parameters
        if (params && typeof params === "object" && parts[2] in params) {
          return params[parts[2]]
        }
      }
    }
  }

  // Handle scrollbar properties (scrollbar.{id}.{property} -> parameters.{property})
  if (parts[0] === "scrollbar" && parts[1] && parts[2]) {
    const scrollbarSection = getNestedValue(themeObj, ["scrollbar"])
    if (scrollbarSection && typeof scrollbarSection === "object") {
      const scrollbar = (scrollbarSection as Record<string, unknown>)[parts[1]]
      if (scrollbar && typeof scrollbar === "object" && "parameters" in scrollbar) {
        const params = (scrollbar as { parameters?: Record<string, unknown> }).parameters
        if (params && typeof params === "object" && parts[2] in params) {
          return params[parts[2]]
        }
      }
    }
  }

  return undefined
}

/**
 * Creates a FlatProperty from a schema and theme value
 */
function createFlatPropertyFromSchema(
  schema: import("@seldon/core/themes/schemas").ThemeTokenSchema,
  value: unknown,
  theme: Theme,
): FlatProperty {
  // Handle special formatting for certain value types
  let formattedValue = value
  let actualValue = String(value)

  // For combo/menu controls with options, look up the label from options
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

  // Format HSL colors
  if (schema.key === "color.baseColor" && value && typeof value === "object" && "hue" in value) {
    formattedValue = value // Keep as HSL object for color picker
    actualValue = HSLObjectToString(value as { hue: number; saturation: number; lightness: number })
  }

  // Format swatch colors (HSL objects)
  if (schema.key.startsWith("swatch.") && value && typeof value === "object" && "hue" in value) {
    formattedValue = value // Keep as HSL object for color picker
    actualValue = HSLObjectToString(value as { hue: number; saturation: number; lightness: number })
  }

  // Determine if this is a calculated swatch (white, gray, black, primary, swatch1-4)
  // These should be read-only and not editable
  const calculatedSwatches = ["white", "gray", "black", "primary", "swatch1", "swatch2", "swatch3", "swatch4"]
  const isCalculatedSwatch = schema.key.startsWith("swatch.") && 
    calculatedSwatches.some(swatchId => schema.key === `swatch.${swatchId}`)

  // Stringify complex values for text controls
  if (
    schema.controlType === "text" &&
    value &&
    typeof value === "object" &&
    !("hue" in value)
  ) {
    formattedValue = stringifyValue(value)
    actualValue = formattedValue as string
  }

  // Handle boolean values for scrollbar.rounded
  if (schema.key.includes("rounded") && typeof value === "boolean") {
    actualValue = value ? "On" : "Off"
  }

  // Use IconColorValue for swatch properties and color point properties to show color-filled icons
  // For color point properties, get the actual HSL color from computed swatches
  // These swatches already incorporate the bleed value in their calculation
  // For baseColor, use the HSL color directly
  let iconColorValue: string | undefined = undefined
  if (schema.key === "color.baseColor" && value && typeof value === "object" && "hue" in value) {
    // Base color HSL object
    iconColorValue = HSLObjectToString(value as { hue: number; saturation: number; lightness: number })
  } else if (schema.key === "color.whitePoint") {
    iconColorValue = themeSwatchToCssBackground(theme.swatch.white)
  } else if (schema.key === "color.grayPoint") {
    iconColorValue = themeSwatchToCssBackground(theme.swatch.gray)
  } else if (schema.key === "color.blackPoint") {
    iconColorValue = themeSwatchToCssBackground(theme.swatch.black)
  }
  
  // Use IconColorValue for swatch properties and color point properties to show color-filled icons
  // Bleed is just a percentage, so it doesn't get a color icon
  // Otherwise use schema icon if provided, or step icon for .step properties
  const icon = (schema.key.startsWith("swatch.") || 
                schema.key === "color.baseColor" ||
                schema.key === "color.whitePoint" || 
                schema.key === "color.grayPoint" || 
                schema.key === "color.blackPoint")
    ? "IconColorValue" 
    : (schema.icon || (schema.key.endsWith(".step") ? "IconStepValue" : "IconSeldonComponent"))

  // Map schema controlType to FlatProperty controlType
  // FlatProperty.ControlType doesn't include "boolean" or "color", so map them appropriately
  let controlType: import("./properties-registry").ControlType | undefined = undefined
  if (schema.controlType === "boolean") {
    // Boolean controls aren't supported in FlatProperty, use menu instead
    controlType = "menu" as const
  } else if (schema.controlType === "color") {
    // Color controls aren't supported in FlatProperty, use text instead
    controlType = "text" as const
  } else if (schema.controlType === "number") {
    controlType = "number" as const
  } else if (schema.controlType === "text") {
    controlType = "text" as const
  } else if (schema.controlType === "combo") {
    controlType = "combo" as const
  } else if (schema.controlType === "menu") {
    controlType = "menu" as const
  }
  
  // Store color value for color point properties (for icon display)
  // We'll store it in a way that RowProperty can access it
  const flatProperty: FlatProperty = {
    key: schema.key,
    propertyType: "atomic",
    label: schema.label ?? schema.key,
    icon,
    value: { type: ValueType.EXACT, value: formattedValue },
    actualValue,
    valueType: ValueType.EXACT,
    controlType,
    isCompound: false,
    isShorthand: false,
    isSubProperty: false,
    status: "set",
    isDimmed: isCalculatedSwatch,
  }
  
  // Store color value for color point properties in a custom property
  // RowProperty will use this to pass color to icon
  if (iconColorValue) {
    flatProperty.iconColorValue = iconColorValue
  }
  
  return flatProperty
}

/**
 * Updates schema labels with actual names from theme (for modulation values)
 */
function updateSchemaLabelsWithThemeNames(
  schemas: import("@seldon/core/themes/schemas").ThemeTokenSchema[],
  theme: Theme,
): import("@seldon/core/themes/schemas").ThemeTokenSchema[] {
  return schemas.map((schema) => {
    // For modulation values (.step properties), update label with actual name from theme
    if (schema.key.endsWith(".step")) {
      const parts = schema.key.split(".")
      const sectionKey = parts[0]
      const subKey = parts[1]

      const section = (theme as unknown as Record<string, Record<string, { name: string }>>)[sectionKey]
      if (section && section[subKey]?.name) {
        return {
          ...schema,
          label: section[subKey].name,
        }
      }
    }

    // For fontWeight properties, update label with actual name from theme
    if (schema.key.startsWith("fontWeight.")) {
      const fontWeightKey = schema.key.split(".")[1]
      const fontWeight = theme.fontWeight[fontWeightKey as keyof typeof theme.fontWeight]
      if (fontWeight?.name) {
        return {
          ...schema,
          label: fontWeight.name,
        }
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

  // Get all schemas from schema system
  const allSchemas = getAllThemeTokenSchemas(theme)

  // Update schema labels with actual names from theme
  const schemasWithLabels = updateSchemaLabelsWithThemeNames(allSchemas, theme)

  // Create FlatProperty for each schema
  for (const schema of schemasWithLabels) {
    const value = getThemeValueByKey(theme, schema.key)

    // Skip if value is undefined (property doesn't exist in theme)
    if (value === undefined) {
      continue
    }

    const flatProperty = createFlatPropertyFromSchema(schema, value, theme)
    properties.push(flatProperty)
  }

  return properties
}
