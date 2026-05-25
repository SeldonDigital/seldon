/**
 * Validates if a string represents a valid number with optional range constraints.
 *
 * @param value - The string to validate
 * @param options - Optional min/max range constraints
 * @returns True if the value is a valid number within the specified range
 */
export function isNumber(
  value: string,
  options?: { min?: number; max?: number },
) {
  if (!/^-?\d+(\.\d+)?$/.test(value)) {
    return false
  }

  const number = Number(value)
  if (options?.min && number < options.min) {
    return false
  }

  if (options?.max && number > options.max) {
    return false
  }
  return true
}
