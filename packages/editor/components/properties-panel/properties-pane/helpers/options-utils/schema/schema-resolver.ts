import {
  getCompoundSubPropertySchema,
  getPropertySchema,
  getSubPropertySchema,
} from "@seldon/core/properties/schemas"
import { PropertySchema } from "@seldon/core/properties/types/schema"

/**
 * Get the appropriate schema for a property, handling sub-properties
 */
export function getPropertySchemaForProperty(
  propertyKey: string,
): PropertySchema | null {
  // Try direct schema first
  let schema = getPropertySchema(propertyKey)
  if (schema) return schema

  // Handle sub-properties
  if (propertyKey.includes(".")) {
    const [parentProperty, subProperty] = propertyKey.split(".")

    // Try compound sub-property schema
    schema = getCompoundSubPropertySchema(parentProperty, subProperty)
    if (schema) return schema

    // Try shorthand sub-property schema
    schema = getSubPropertySchema(parentProperty, subProperty)
    if (schema) return schema
  }

  return null
}
