import { HSL } from "../../properties/values/color/hsl"
import { RGB } from "../../properties/values/color/rgb"
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
