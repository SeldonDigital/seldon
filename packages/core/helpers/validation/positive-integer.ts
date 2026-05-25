/**
 * Validates if a string represents a positive integer (whole number >= 0).
 *
 * @param value - The string to validate
 * @returns True if the value is a valid positive integer
 */
export function isPositiveInteger(value: string) {
  return /^\d+$/.test(value)
}
