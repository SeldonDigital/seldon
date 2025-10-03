import { isValidPositionValue } from "../../validation/size"

/**
 * Checks if a string represents a valid double-axis value (e.g., "10px 20px").
 * @param value - The string to validate
 * @returns True if the value contains exactly two valid position values
 */
export function isDoubleAxisValue(value: string) {
  const values = value
    .trim()
    .split(/\s+/)
    .filter((v) => v.length > 0)

  if (values.length !== 2) {
    return false
  }

  return values.every(isValidPositionValue)
}
