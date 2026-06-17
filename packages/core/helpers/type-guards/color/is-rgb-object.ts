import { RGB } from "../../../properties/values/shared/exact/rgb"

/**
 * Type guard that checks if a value is a valid RGB color object
 *
 * @param value - The value to check
 * @returns True if the value is a valid RGB object with red, green, and blue properties
 */
export function isRGBObject(value: unknown): value is RGB {
  return (
    typeof value === "object" &&
    value !== null &&
    "red" in value &&
    "green" in value &&
    "blue" in value &&
    typeof (value as RGB).red === "number" &&
    typeof (value as RGB).green === "number" &&
    typeof (value as RGB).blue === "number"
  )
}
