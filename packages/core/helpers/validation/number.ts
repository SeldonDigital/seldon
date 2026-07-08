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
  // Accept an optional leading integer part, so a bare-decimal like `-.2` or
  // `.2` validates the same as `-0.2`. Requires at least one digit.
  if (!/^-?(?:\d+|\d*\.\d+)$/.test(value)) {
    return false
  }

  const number = Number(value)
  if (options?.min !== undefined && number < options.min) {
    return false
  }

  if (options?.max !== undefined && number > options.max) {
    return false
  }
  return true
}
