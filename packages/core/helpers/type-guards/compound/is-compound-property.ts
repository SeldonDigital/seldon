import {
  CompoundPropertyKey,
  PropertyKey,
} from "../../../properties/types/properties"

const COMPOUND_PROPERTY_KEYS: PropertyKey[] = [
  "background",
  "border",
  "corners",
  "font",
  "gradient",
  "margin",
  "padding",
  "position",
  "shadow",
]

/**
 * Type guard that checks if a property key is a compound property
 *
 * @param key - The property key to check
 * @returns True if the property is a compound property with subproperties
 */
export function isCompoundProperty(
  key: PropertyKey,
): key is CompoundPropertyKey {
  return COMPOUND_PROPERTY_KEYS.includes(key)
}
