import { Properties, ValueType } from "../../index"

/**
 * Merges two sets of properties with optional sub-property merging.
 *
 * Sub-property merging applies to compound and shorthand properties,
 * which have nested sub-properties (e.g., background.color, margin.top).
 *
 * @param properties1 - Base properties to merge into
 * @param properties2 - Properties to merge from
 * @param options - Merge configuration options
 * @returns Merged properties with empty values filtered out
 */
export function mergeProperties(
  properties1: Properties = {},
  properties2: Properties = {},
  options?: {
    mergeSubProperties?: boolean
  },
): Properties {
  const keys = Object.keys(properties2) as Array<keyof Properties>

  const { mergeSubProperties = true } = options ?? {}

  return keys.reduce((merged, key) => {
    let value: any

    if (key in properties1) {
      if (mergeSubProperties) {
        // Check if this is a compound or shorthand property
        const existingValue = properties1[key]
        const newValue = properties2[key]

        if (
          existingValue &&
          typeof existingValue === "object" &&
          !("type" in existingValue) &&
          newValue &&
          typeof newValue === "object" &&
          !("type" in newValue)
        ) {
          // This is a compound or shorthand property - do a deep merge
          value = { ...existingValue, ...newValue }
        } else {
          // This is an atomic property - use shallow merge
          value = Object.assign({}, existingValue, newValue)
        }
      } else {
        value = properties2[key]
      }
    } else {
      value = properties2[key]
    }

    // Skip empty values to allow inheritance from defaults
    if (
      value &&
      typeof value === "object" &&
      "type" in value &&
      value.type === ValueType.EMPTY
    ) {
      return merged
    }

    return {
      ...merged,
      [key]: value,
    }
  }, properties1)
}
