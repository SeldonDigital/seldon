import { ControlType } from "./properties-registry"
import { FlatProperty } from "./properties-data"
import { getThemeTokenSchema } from "@seldon/core/themes/schemas"

/**
 * Maps theme property keys to appropriate control types using schema system.
 * Falls back to text control if schema is not found.
 *
 * @param property - The flat property to get control type for
 * @returns Control type for the property
 */
export function getThemePropertyControlType(property: FlatProperty): ControlType {
  const schema = getThemeTokenSchema(property.key)
  
  if (schema) {
    return schema.controlType as ControlType
  }

  // Fallback for properties not yet in schema (shouldn't happen in production)
  return "text"
}

/**
 * Formats theme property value for display
 */
export function formatThemePropertyValue(property: FlatProperty): string {
  const value = property.value

  if (typeof value === "object" && value !== null && "value" in value) {
    return String(value.value)
  }

  return String(value)
}
