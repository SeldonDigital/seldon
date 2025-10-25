import { produce } from "immer"
import { Properties, PropertyKey, Value } from "../../properties"
import { isCompoundValue } from "../type-guards/compound/is-compound-value"

/**
 * Removes allowedValues restrictions from all properties in a Properties object.
 *
 * @param properties - The properties object to process
 * @returns A new Properties object with allowedValues removed from all values
 */
export function removeAllowedValuesFromProperties(properties: Properties) {
  // Check for circular references before using Immer
  const visited = new Set<object>()
  if (hasCircularReference(properties, visited)) {
    throw new Error("Circular reference detected in properties object")
  }

  return produce(properties, (draft) => {
    for (const key in draft) {
      const value = draft[key as PropertyKey]
      removeAllowedValuesFromValue(value!, new Set())
    }
  })
}

/**
 * Checks if an object has circular references
 */
function hasCircularReference(
  obj: any,
  visited: Set<object>,
  depth = 0,
): boolean {
  // Prevent infinite recursion with depth limit
  if (depth > 10) {
    return true
  }

  if (obj === null || typeof obj !== "object") {
    return false
  }

  if (visited.has(obj)) {
    return true
  }

  visited.add(obj)

  try {
    for (const key in obj) {
      if (hasCircularReference(obj[key], visited, depth + 1)) {
        return true
      }
    }
  } finally {
    visited.delete(obj)
  }

  return false
}

/**
 * Recursively removes allowedValues from a Value object and its nested values.
 *
 * @param value - The value to process
 * @param visited - Set to track visited objects and prevent circular references
 * @param depth - Current recursion depth (default: 0)
 */
function removeAllowedValuesFromValue(
  value: Value,
  visited: Set<object>,
  depth = 0,
) {
  // Prevent infinite recursion with depth limit
  if (depth > 10) {
    return
  }

  // Prevent circular references
  if (visited.has(value)) {
    return
  }

  if (isCompoundValue(value)) {
    visited.add(value)
    Object.values(value).forEach((subValue) => {
      if (subValue && typeof subValue === "object" && "type" in subValue) {
        removeAllowedValuesFromValue(subValue as Value, visited, depth + 1)
      }
    })
    visited.delete(value)
  } else {
    // Handle both old structure (allowedValues as direct property) and new structure (allowedValues under restrictions)
    if ("allowedValues" in value) {
      delete value.allowedValues
    }

    if (
      "restrictions" in value &&
      value.restrictions &&
      "allowedValues" in value.restrictions
    ) {
      delete value.restrictions.allowedValues
      // Remove the restrictions object if it's now empty
      if (Object.keys(value.restrictions).length === 0) {
        delete value.restrictions
      }
    }
  }
}
