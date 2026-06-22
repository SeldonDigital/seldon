import { getPropertyRegistryEntry } from "@lib/icons/icons-registry"
import { getParentPathForPreset } from "@lib/properties/property-paths"
import { getPropertyCategory } from "@seldon/core/properties/schemas"

/**
 * UI-specific property type definitions and utilities.
 * Property category checks delegate to `getPropertyCategory` from @seldon/core.
 */

export type PropertyType = "atomic" | "compound" | "shorthand"

/**
 * Checks if a property key is a shorthand property
 * @param propertyKey - The property key to check
 * @returns True if the property is a shorthand property
 */
export function isShorthandProperty(propertyKey: string): boolean {
  return getPropertyCategory(propertyKey) === "shorthand"
}

/**
 * Checks if a property key is a compound property
 * @param propertyKey - The property key to check
 * @returns True if the property is a compound property
 */
export function isCompoundProperty(propertyKey: string): boolean {
  return getPropertyCategory(propertyKey) === "compound"
}

/**
 * Checks if a property key is a preset property
 * @param propertyKey - The property key to check
 * @returns True if the property key ends with ".preset"
 */
export function isPresetProperty(propertyKey: string): boolean {
  return propertyKey.endsWith(".preset")
}

/**
 * Gets sub-property keys for a given property
 * @param propertyKey - The property key to get sub-properties for
 * @returns Array of sub-property keys
 */
export function getSubPropertyKeys(propertyKey: string): string[] {
  const registryEntry = getPropertyRegistryEntry(propertyKey)
  if (registryEntry?.subProperties) {
    return Object.keys(registryEntry.subProperties)
  }
  return []
}

/**
 * Gets the parent property key from a preset property key
 * @param presetPropertyKey - The preset property key (e.g., "border.preset")
 * @returns The parent property key (e.g., "border")
 */
export function getParentPropertyKey(presetPropertyKey: string): string {
  return getParentPathForPreset(presetPropertyKey)
}

/**
 * Determines if a property should use shorthand main property behavior
 * @param propertyKey - The property key to check
 * @returns True if the property is a shorthand property
 */
export function shouldUseShorthandMainPropertyBehavior(
  propertyKey: string,
): boolean {
  return isShorthandProperty(propertyKey)
}

/**
 * Determines if a property should use preset property behavior
 * @param propertyKey - The property key to check
 * @returns True if the property is a preset property
 */
export function shouldUsePresetPropertyBehavior(propertyKey: string): boolean {
  return isPresetProperty(propertyKey)
}
