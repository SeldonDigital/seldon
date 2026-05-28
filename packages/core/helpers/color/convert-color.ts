import { HSL } from "../../properties/values/shared/exact/hsl"
import { LCH } from "../../properties/values/shared/exact/lch"
import { RGB } from "../../properties/values/shared/exact/rgb"
import { isHSLString, isHex, isRGBString } from "../validation/color"
import { HSLObjectToString } from "./hsl-object-to-string"

/**
 * Parse an RGB string into an RGB object.
 *
 * @param value - The RGB string to parse (e.g., "rgb(255, 0, 0)")
 * @returns An RGB object with red, green, and blue properties
 */
function parseRGB(value: string): RGB {
  const inner = value.slice(4, -1).replace(/\s+/g, " ").trim()
  const parts = inner
    .split(/,| /)
    .map((s) => s.trim())
    .filter(Boolean)
  if (parts.length !== 3) throw new Error(`Invalid RGB value: ${value}`)

  return {
    red: Number(parts[0]),
    green: Number(parts[1]),
    blue: Number(parts[2]),
  }
}

/**
 * Convert a hsl, hex or rgb color value to an HSL string
 *
 * @param value - The color value to convert
 * @returns An HSL string
 */
export function toHSLString(value: string): string {
  if (isHSLString(value)) return value
  if (isHex(value)) return hexToHSLString(value)
  if (isRGBString(value)) {
    const rgb = parseRGB(value)
    const hsl = rgbToHSL(rgb)
    return HSLObjectToString(hsl)
  }
  throw new Error(`Invalid color value: ${value}`)
}

/**
 * Parse an HSL string into an HSL object.
 *
 * @param value - The HSL string to parse (e.g., "hsl(120, 50%, 50%)" or "hsl(120 50% 50%)")
 * @returns An HSL object with hue, saturation, and lightness properties
 */
export function parseHSLString(value: string): HSL {
  // Handle both formats: "hsl(120, 50%, 50%)" and "hsl(120 50% 50%)"
  const match = value.match(
    /^hsl\(\s*(\d+)(?:deg)?\s*[,]?\s*(\d+)%?\s*[,]?\s*(\d+)%?\s*\)$/i,
  )
  if (!match) {
    throw new Error(`Invalid HSL string: ${value}`)
  }

  const [, hueStr, saturationStr, lightnessStr] = match
  const hue = parseInt(hueStr, 10)
  const saturation = parseInt(saturationStr, 10)
  const lightness = parseInt(lightnessStr, 10)

  if (isNaN(hue) || isNaN(saturation) || isNaN(lightness)) {
    throw new Error(`Invalid HSL string: ${value}`)
  }
  if (hue < 0 || hue > 360) {
    throw new Error(`Invalid HSL string: ${value} - hue must be 0-360`)
  }
  if (saturation < 0 || saturation > 100) {
    throw new Error(`Invalid HSL string: ${value} - saturation must be 0-100`)
  }
  if (lightness < 0 || lightness > 100) {
    throw new Error(`Invalid HSL string: ${value} - lightness must be 0-100`)
  }

  return { hue, saturation, lightness }
}

/**
 * Parse an RGB string into an RGB object with range validation.
 *
 * @param value - The RGB string to parse (e.g., "rgb(255, 0, 0)" or "rgb(255 0 0)")
 * @returns An RGB object with red, green, and blue components (0-255)
 * @throws An error if the string is malformed or a component is out of range
 */
export function parseRGBString(value: string): RGB {
  const match =
    /^rgb\(\s*(\d{1,3})(\s*,\s*|\s+)(\d{1,3})(\s*,\s*|\s+)(\d{1,3})\s*\)$/i.exec(
      value,
    )

  if (!match) {
    throw new Error("Invalid RGB string: " + value)
  }

  const [, red, , green, , blue] = match
  const r = parseInt(red)
  const g = parseInt(green)
  const b = parseInt(blue)

  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    const invalidValues = []
    if (r < 0 || r > 255) invalidValues.push(`red: ${r}`)
    if (g < 0 || g > 255) invalidValues.push(`green: ${g}`)
    if (b < 0 || b > 255) invalidValues.push(`blue: ${b}`)
    throw new Error(
      `Invalid RGB string: ${value} - ${invalidValues.join(", ")} must be between 0 and 255`,
    )
  }

  return { red: r, green: g, blue: b }
}

/**
 * Parse an LCH string into an LCH object with range validation.
 *
 * @param value - The LCH string to parse (e.g., "lch(50% 100 120deg)" or "lch(50, 100, 120)")
 * @returns An LCH object with lightness, chroma, and hue components
 * @throws An error if the string is malformed or a component is out of range
 */
export function parseLCHString(value: string): LCH {
  const match =
    /^lch\(\s*(\d+)%?\s*[,]?\s*(\d+(?:\.\d+)?)\s*[,]?\s*(\d+)(deg)?\s*\)$/i.exec(
      value,
    )

  if (!match) {
    throw new Error("Invalid LCH string: " + value)
  }

  const [, lightness, chroma, hue] = match
  const l = parseInt(lightness)
  const c = parseFloat(chroma)
  const h = parseInt(hue)

  if (l < 0 || l > 100 || c < 0 || c > 150 || h < 0 || h > 360) {
    const invalidValues = []
    if (l < 0 || l > 100) invalidValues.push(`lightness: ${l}`)
    if (c < 0 || c > 150) invalidValues.push(`chroma: ${c}`)
    if (h < 0 || h > 360) invalidValues.push(`hue: ${h}`)
    throw new Error(
      `Invalid LCH string: ${value} - ${invalidValues.join(", ")} out of range (lightness: 0-100, chroma: 0-150, hue: 0-360)`,
    )
  }

  return { lightness: l, chroma: c, hue: h }
}

/**
 * Convert a hex color value to an HSL string
 *
 * @param value - The hex color value to convert
 * @returns An HSL string
 */
export function hexToHSLString(value: string): string {
  const hsl = hexToHSLObject(value)
  return HSLObjectToString(hsl)
}

/**
 * Convert a hex color value to an HSL object.
 *
 * @param value - The hex color value to convert
 * @returns An HSL object with hue, saturation, and lightness properties
 */
export function hexToHSLObject(value: string): HSL {
  return rgbToHSL(hexToRGBObject(value))
}

/**
 * Convert an RGB object to an HSL object using standard color space conversion.
 *
 * @param rgb - The RGB object to convert
 * @returns An HSL object with hue (0-360), saturation (0-100), and lightness (0-100)
 */
export function rgbToHSL(rgb: RGB): HSL {
  const { red, green, blue } = rgb
  const r = red / 255
  const g = green / 255
  const b = blue / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  return {
    hue: Math.round(h * 360),
    saturation: Math.round(s * 100),
    lightness: Math.round(l * 100),
  }
}

/**
 * Convert a hex color value to an RGB string.
 *
 * @param value - The hex color value to convert
 * @returns An RGB string (e.g., "rgb(255, 0, 0)")
 */
export function hexToRGBString(value: string): string {
  const { red, green, blue } = hexToRGBObject(value)
  return `rgb(${red}, ${green}, ${blue})`
}

/**
 * Convert a hex color value to an RGB object.
 *
 * @param value - The hex color value to convert (e.g., "#ff0000" or "ff0000")
 * @returns An RGB object with red, green, and blue properties (0-255)
 */
export function hexToRGBObject(value: string): RGB {
  const [r, g, b] = value.match(/\w\w/g)!.map((hex) => parseInt(hex, 16))
  return { red: r, green: g, blue: b }
}
