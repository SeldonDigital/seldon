import { HSL } from "../../../properties/values/color/hsl"

/**
 * Type guard that checks if a value is a valid HSL color object
 *
 * @param value - The value to check
 * @returns True if the value is a valid HSL object with hue, saturation, and lightness properties
 */
export function isHSLObject(value: unknown): value is HSL {
  return (
    typeof value === "object" &&
    value !== null &&
    "hue" in value &&
    "saturation" in value &&
    "lightness" in value &&
    typeof (value as HSL).hue === "number" &&
    typeof (value as HSL).saturation === "number" &&
    typeof (value as HSL).lightness === "number"
  )
}
