import { Theme } from "../../themes/types"
import {
  CompoundPropertyKey,
  PropertyKey,
  ShorthandPropertyKey,
} from "../types/properties"
import { PropertySchema, PropertyValueType } from "../types/schema"
import { PROPERTY_SCHEMAS } from "./index"

export function getPropertySchema(
  propertyName: string,
): PropertySchema | undefined {
  return PROPERTY_SCHEMAS[propertyName as keyof typeof PROPERTY_SCHEMAS]
}

export function validatePropertyValue(
  propertyName: string,
  valueType: string,
  value: any,
  theme?: Theme,
): boolean {
  const schema = getPropertySchema(propertyName)
  if (!schema) return false

  const validator =
    schema.validation[valueType as keyof typeof schema.validation]
  if (!validator) return false

  return validator(value, theme)
}

export function getPropertyOptions(
  propertyName: string,
  valueType: string,
  theme?: Theme,
): any[] {
  const schema = getPropertySchema(propertyName)
  if (!schema) return []

  if (valueType === "preset" && schema.presetOptions) {
    return schema.presetOptions()
  }

  if (
    valueType === "themeCategorical" &&
    schema.themeCategoricalKeys &&
    theme
  ) {
    return schema.themeCategoricalKeys(theme)
  }

  if (valueType === "themeOrdinal" && schema.themeOrdinalKeys && theme) {
    return schema.themeOrdinalKeys(theme)
  }

  return []
}

/**
 * Get preset options for a property
 */
export function getPresetOptions(propertyName: string): any[] {
  const schema = getPropertySchema(propertyName)
  return schema?.presetOptions?.() || []
}

/**
 * Get preset options formatted for UI dropdowns
 */
export function getPresetOptionsAsLabelValue(
  propertyName: string,
): Array<{ label: string; value: any }> {
  const options = getPresetOptions(propertyName)
  return options.map((value) => ({
    label: formatLabel(value),
    value: value,
  }))
}

/**
 * Get all property schemas at once
 */
export function getAllPropertySchemas(): Record<string, PropertySchema> {
  return PROPERTY_SCHEMAS
}

/**
 * Convert enum values to UI format
 */
export function formatOptionsForUI(
  options: any[],
): Array<{ label: string; value: any }> {
  return options.map((value) => ({
    label: formatLabel(value),
    value: value,
  }))
}

/**
 * Get supported value types for a property
 */
export function getPropertySupportedValueTypes(
  propertyName: string,
): PropertyValueType[] {
  const schema = getPropertySchema(propertyName)
  return schema?.supports ? [...schema.supports] : []
}

/**
 * Format a value for display in UI (e.g., "top-left" -> "Top Left")
 */
function formatLabel(value: any): string {
  if (typeof value === "string") {
    return value
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }
  return String(value)
}

/**
 * Property category types derived from the type system
 */
export type PropertyCategory = "atomic" | "compound" | "shorthand"

/**
 * Property categories derived from existing type definitions
 */
const COMPOUND_PROPERTIES: readonly string[] = [
  "background",
  "border",
  "font",
  "gradient",
  "shadow",
] as const
const SHORTHAND_PROPERTIES: readonly string[] = [
  "margin",
  "padding",
  "corners",
  "position",
] as const

/**
 * Get property category from type system with validation
 */
export function getPropertyCategory(
  propertyName: string,
): PropertyCategory | undefined {
  // Derive category from type system (temporarily bypassing schema check for debugging)
  if (COMPOUND_PROPERTIES.includes(propertyName)) return "compound"
  if (SHORTHAND_PROPERTIES.includes(propertyName)) return "shorthand"

  // Check if property has a schema (validates it's a real property)
  const schema = getPropertySchema(propertyName)
  if (!schema) {
    return undefined // Property doesn't exist in schema system
  }

  return "atomic"
}

/**
 * Get schema for shorthand sub-properties
 * For shorthand properties like 'margin.top', look up the schema for the sub-property type
 * e.g., 'margin.top' → marginSchema (which applies to all margin sides)
 */
export function getSubPropertySchema(
  parentProperty: string,
  subProperty: string,
): PropertySchema | undefined {
  // For shorthand properties, the parent property schema applies to all sub-properties
  // e.g., margin.top, margin.right, margin.bottom, margin.left all use marginSchema
  const schema = getPropertySchema(parentProperty)
  return schema
}

/**
 * Get schema for compound sub-properties
 * For compound properties like 'background.color', look up the specific sub-property schema
 * e.g., 'background.color' → backgroundColorSchema
 */
export function getCompoundSubPropertySchema(
  parentProperty: string,
  subProperty: string,
): PropertySchema | undefined {
  // For compound properties, sub-properties have their own schemas using naming convention
  // e.g., background.color → backgroundColorSchema
  // e.g., background.image → backgroundImageSchema
  // e.g., border.width → borderWidthSchema
  // e.g., font.size → fontSizeSchema
  const schemaKey = `${parentProperty}${subProperty.charAt(0).toUpperCase()}${subProperty.slice(1)}`
  return getPropertySchema(schemaKey)
}
