import { ControlType } from "@lib/icons/icons-registry"
import { getThemeTokenSchema } from "@seldon/core/themes/schemas"
import { FlatProperty } from "./properties-data"

/**
 * Maps theme property keys to appropriate control types using schema system.
 * Falls back to text control if schema is not found.
 *
 * @param property - The flat property to get control type for
 * @returns Control type for the property
 */
export function getThemePropertyControlType(
  property: FlatProperty,
): ControlType {
  const schema = getThemeTokenSchema(property.key)

  if (schema) {
    return schema.controlType as ControlType
  }

  // Fallback for properties not yet in schema (shouldn't happen in production)
  return "text"
}
