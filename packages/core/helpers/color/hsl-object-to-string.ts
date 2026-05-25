import { HSL } from "../../index"

/**
 * Converts an HSL object to an HSL string with optional opacity.
 *
 * @param hsl - The HSL object to convert
 * @param opacity - The opacity percentage (0-100) or null for no opacity (default: 100)
 * @returns An HSL string (e.g., "hsl(120 50% 50%)" or "hsl(120 50% 50% / 80%)")
 */
export function HSLObjectToString(hsl: HSL, opacity: number | null = 100) {
  return opacity === 100 || opacity === null
    ? `hsl(${hsl.hue} ${hsl.saturation}% ${hsl.lightness}%)`
    : `hsl(${hsl.hue} ${hsl.saturation}% ${hsl.lightness}% / ${opacity}%)`
}
