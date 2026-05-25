/**
 * Validates if a string represents a valid percentage with optional range constraints.
 *
 * @param value - The string to validate (e.g., "50%" or "12.5%")
 * @param options - Optional min/max range constraints for the percentage value
 * @returns True if the value is a valid percentage within the specified range
 */
export function isPercentage(
  value: string,
  options?: { min?: number; max?: number },
) {
  if (!/^\d+(\.\d+)?%$/.test(value)) {
    return false
  }

  const number = Number(value.replace("%", ""))

  if (options?.min && number < options.min) {
    return false
  }

  if (options?.max && number > options.max) {
    return false
  }
  return true
}
