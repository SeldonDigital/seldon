interface IsValidListOf {
  value: string
  validateEach: (value: string) => boolean
  minItems?: number
  maxItems?: number
}

/**
 * Validates a space-separated list of values with configurable constraints.
 * @param value - The space-separated string to validate
 * @param validateEach - Function to validate each individual value
 * @param minItems - Minimum number of items required (default: 0)
 * @param maxItems - Maximum number of items allowed (default: Infinity)
 * @returns True if the list meets all constraints and all items are valid
 */
export function isValidListOf({
  value,
  validateEach,
  minItems = 0,
  maxItems = Infinity,
}: IsValidListOf) {
  const values = value.trim().split(" ")

  if (values.length < minItems || values.length > maxItems) {
    return false
  }

  return values.every(validateEach)
}
