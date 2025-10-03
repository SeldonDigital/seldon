import {
  NestedOverrides,
  NestedOverridesObject,
  NestedOverridesValue,
} from "../../components/types"

/**
 * Flattens a nested nestedOverrides object into dot notation format.
 * Only accepts nested object syntax - flat dot notation is not supported.
 *
 * @param obj - The nested object to flatten
 * @param prefix - The prefix to use for keys (used internally for recursion)
 * @returns A flattened object with dot notation keys
 * @throws Error if flat dot notation syntax is detected
 *
 * @example
 * flattenNestedOverridesObject({
 *   icon: { symbol: "material-add" },
 *   label: { content: "Add" }
 * })
 * // Returns: { "icon.symbol": "material-add", "label.content": "Add" }
 *
 * @example
 * flattenNestedOverridesObject({
 *   "icon.symbol": "material-add",  // ❌ This will throw an error
 *   "label.content": "Add"
 * })
 */
export function flattenNestedOverridesObject(
  obj: NestedOverrides | NestedOverridesObject,
  prefix: string = "",
): Record<string, NestedOverridesValue> {
  // Check for flat dot notation syntax at the root level (when prefix is empty)
  if (prefix === "") {
    const hasFlatDotNotation = Object.keys(obj).some((key) => key.includes("."))
    if (hasFlatDotNotation) {
      throw new Error(
        "Flat dot notation syntax is not supported. Use nested object syntax instead.\n" +
          '❌ Invalid: { "icon.symbol": "material-add" }\n' +
          '✅ Valid: { icon: { symbol: "material-add" } }',
      )
    }
  }

  const flattened: Record<string, NestedOverridesValue> = {}

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key

    if (value && typeof value === "object" && !Array.isArray(value)) {
      // Check if this is a complex value object (has unit and value properties)
      if (
        "unit" in value &&
        "value" in value &&
        Object.keys(value).length === 2
      ) {
        // This is a complex value object, preserve it as-is
        flattened[newKey] = value
      } else {
        // Recursively flatten other nested objects
        Object.assign(flattened, flattenNestedOverridesObject(value, newKey))
      }
    } else {
      flattened[newKey] = value
    }
  }

  return flattened
}
