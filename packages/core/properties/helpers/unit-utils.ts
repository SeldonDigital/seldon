import { Unit } from "../constants"
import { getPropertySchema } from "../schemas/helpers"

/**
 * Gets available units for a property from its schema
 * @param propertyKey - The property key to get units for
 * @returns Array of available unit strings
 */
export function getUnitsForProperty(propertyKey: string): string[] {
  const actualProperty = propertyKey.includes(".")
    ? propertyKey.split(".").pop()!
    : propertyKey
  const schema = getPropertySchema(actualProperty)

  if (schema?.units?.allowed) {
    return schema.units.allowed.map((unit) => unit)
  }

  // Fallback for compound properties and unknown properties
  // This matches the original hardcoded behavior
  return ["px", "rem", "%"]
}

/**
 * Gets the default unit for a property from its schema
 * @param propertyKey - The property key to get default unit for
 * @returns The default unit for the property
 */
export function getDefaultUnitForProperty(propertyKey: string): Unit {
  const actualProperty = propertyKey.includes(".")
    ? propertyKey.split(".").pop()!
    : propertyKey
  const schema = getPropertySchema(actualProperty)
  return schema?.units?.default || Unit.PX
}

/**
 * Gets number validation type for a property from its schema
 * @param propertyKey - The property key to get validation type for
 * @returns The validation type: "number", "percentage", or "both"
 */
export function getNumberValidation(
  propertyKey: string,
): "number" | "percentage" | "both" {
  const actualProperty = propertyKey.includes(".")
    ? propertyKey.split(".").pop()!
    : propertyKey
  const schema = getPropertySchema(actualProperty)
  return schema?.units?.validation || "both"
}
