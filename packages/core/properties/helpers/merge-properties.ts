import { Properties, ValueType } from "../../index"

/**
 * Merges two sets of properties with optional sub-property merging.
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
    const value =
      key in properties1
        ? mergeSubProperties
          ? Object.assign({}, properties1[key], properties2[key])
          : properties2[key]
        : properties2[key]

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
