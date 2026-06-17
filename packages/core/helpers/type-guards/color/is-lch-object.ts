import { LCH } from "../../../index"

/**
 * Type guard that checks if a value is a valid LCH color object
 *
 * @param value - The value to check
 * @returns True if the value is a valid LCH object with lightness, chroma, and hue properties
 */
export function isLCHObject(value: unknown): value is LCH {
  return (
    typeof value === "object" &&
    value !== null &&
    "lightness" in value &&
    "chroma" in value &&
    "hue" in value &&
    typeof (value as LCH).lightness === "number" &&
    typeof (value as LCH).chroma === "number" &&
    typeof (value as LCH).hue === "number"
  )
}
