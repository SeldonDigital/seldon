import { ColorValue, EmptyValue } from "../../../index"

/**
 * Type guard that checks if a color value has a valid string value
 *
 * @param value - The color value to check
 * @returns True if the value is a valid color value with a string value property
 */
export function isValidColorValue(
  value: ColorValue | EmptyValue,
): value is Extract<ColorValue, { value: string }> {
  return (
    value !== null &&
    typeof value === "object" &&
    "value" in value &&
    typeof value.value === "string"
  )
}
