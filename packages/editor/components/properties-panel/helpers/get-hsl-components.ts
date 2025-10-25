import { HSL } from "@seldon/core"

/**
 * Extracts hue (h), saturation (s) and lightness (l) from a valid HSL string.
 *
 * @param hslString - A valid HSL string.
 * @returns An object containing the HSL components.
 * @throws An error if the input string is not a valid HSL string.
 */
export function getHSLComponents(hslString: string): HSL {
  const pattern =
    /^hsl\(\s*(\d+)(?:deg)?\s*[,]?\s*(\d+)%?\s*[,]?\s*(\d+)%?\s*\)$/i

  const match = pattern.exec(hslString)

  if (match) {
    const [, hueStr, saturationStr, lightnessStr] = match
    const hue = parseInt(hueStr, 10)
    const saturation = parseInt(saturationStr, 10)
    const lightness = parseInt(lightnessStr, 10)

    if (
      hue < 0 ||
      hue > 360 ||
      saturation < 0 ||
      saturation > 100 ||
      lightness < 0 ||
      lightness > 100
    ) {
      const invalidValues = []
      if (hue < 0 || hue > 360) invalidValues.push(`hue: ${hue}`)
      if (saturation < 0 || saturation > 100)
        invalidValues.push(`saturation: ${saturation}`)
      if (lightness < 0 || lightness > 100)
        invalidValues.push(`lightness: ${lightness}`)
      throw new Error(
        `Invalid HSL string: ${hslString} - ${invalidValues.join(", ")} out of range (hue: 0-360, saturation/lightness: 0-100)`,
      )
    }

    return { hue, saturation, lightness }
  }

  throw new Error("Invalid HSL string: " + hslString)
}
