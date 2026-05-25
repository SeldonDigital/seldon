import { RGB } from "../../index"

/**
 * Converts an RGB object to an RGB string with optional opacity.
 *
 * @param rgb - The RGB object to convert
 * @param opacity - The opacity percentage (0-100) or null for no opacity (default: 100)
 * @param brightness - The brightness adjustment (currently unused)
 * @returns An RGB string (e.g., "rgb(255 0 0)" or "rgb(255 0 0 / 80%)")
 */
export function RGBObjectToString(
  rgb: RGB,
  opacity: number | null = 100,
  brightness: number | null = 0,
) {
  return opacity === 100 || opacity === null
    ? `rgb(${rgb.red} ${rgb.green} ${rgb.blue})`
    : `rgb(${rgb.red} ${rgb.green} ${rgb.blue} / ${opacity}%)`
}
