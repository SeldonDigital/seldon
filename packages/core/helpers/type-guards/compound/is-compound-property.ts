import { isCompoundCatalogProperty } from "../../../properties/constants/shared/compound-properties"
import {
  CompoundPropertyKey,
  PropertyKey,
} from "../../../properties/types/property-keys"

/**
 * Type guard that checks if a property key is a compound property
 *
 * @param key - The property key to check
 * @returns True if the property is a compound property with subproperties
 */
export function isCompoundProperty(
  key: PropertyKey,
): key is CompoundPropertyKey {
  return isCompoundCatalogProperty(key)
}
