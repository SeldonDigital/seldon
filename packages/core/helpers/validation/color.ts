import { isThemeValueKey } from "./theme"

/**
 * Validates if a string is a valid color value (HSL, RGB, HEX, LCH, or theme swatch).
 *
 * @param value - The color string to validate
 * @returns True if the value is a valid color format
 */
export function isValidColor(value: string) {
  return (
    isHex(value) ||
    isHexWithoutHash(value) ||
    isHSLString(value) ||
    isRGBString(value) ||
    isLCHString(value) ||
    (isThemeValueKey(value) && value.startsWith("@swatch."))
  )
}

/**
 * Validates if a string is a valid exact color value (HSL, RGB, HEX, or LCH).
 *
 * @param value - The color string to validate
 * @returns True if the value is a valid exact color format
 */
export function isValidExactColor(value: string) {
  return (
    isHex(value) ||
    isHSLString(value) ||
    isRGBString(value) ||
    isLCHString(value)
  )
}

/**
 * Validates HSL color strings with range validation (e.g., "hsl(120, 50%, 50%)").
 *
 * @param value - The string to validate
 * @returns True if the value is a valid HSL color with proper ranges
 */
export function isHSLString(value: string) {
  return (
    /^hsl\(\s*\d{1,3}(?:deg)?\s*[,]?\s*(?:100|[1-9][0-9]?|[0-9])%?\s*[,]?\s*(?:100|[1-9][0-9]?|[0-9])%?\s*\)$/i.test(
      value,
    ) &&
    (() => {
      const match = value.match(
        /^hsl\(\s*(\d{1,3})(?:deg)?\s*[,]?\s*(\d{1,3})%?\s*[,]?\s*(\d{1,3})%?\s*\)$/i,
      )
      if (!match) return false
      const [, hue, saturation, lightness] = match
      const h = parseInt(hue)
      const s = parseInt(saturation)
      const l = parseInt(lightness)
      return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100
    })()
  )
}

/**
 * Validates RGB color strings with range validation (e.g., "rgb(255, 0, 0)").
 *
 * @param value - The string to validate
 * @returns True if the value is a valid RGB color with proper ranges
 */
export function isRGBString(value: string) {
  return (
    /^rgb\(\s*\d{1,3}(\s*,\s*|\s+)?\d{1,3}(\s*,\s*|\s+)?\d{1,3}\s*\)$/i.test(
      value,
    ) &&
    (() => {
      const match = value.match(
        /^rgb\(\s*(\d{1,3})(\s*,\s*|\s+)(\d{1,3})(\s*,\s*|\s+)(\d{1,3})\s*\)$/i,
      )
      if (!match) return false
      const [, red, , green, , blue] = match
      const r = parseInt(red)
      const g = parseInt(green)
      const b = parseInt(blue)
      return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255
    })()
  )
}

/**
 * Validates LCH color strings with range validation (e.g., "lch(50%, 100, 120deg)").
 *
 * @param value - The string to validate
 * @returns True if the value is a valid LCH color with proper ranges
 */
export function isLCHString(value: string) {
  return (
    /^lch\(\s*(100|[1-9][0-9]?|[0-9])%?\s*[,]?\s*(\d+(?:\.\d+)?)\s*[,]?\s*\d{1,3}(deg)?\s*\)$/i.test(
      value,
    ) &&
    (() => {
      const match = value.match(
        /^lch\(\s*(\d+)%?\s*[,]?\s*(\d+(?:\.\d+)?)\s*[,]?\s*(\d+)(deg)?\s*\)$/i,
      )
      if (!match) return false
      const [, lightness, chroma, hue] = match
      const l = parseInt(lightness)
      const c = parseFloat(chroma)
      const h = parseInt(hue)
      return l >= 0 && l <= 100 && c >= 0 && c <= 150 && h >= 0 && h <= 360
    })()
  )
}

/**
 * Validates hex color strings with hash (e.g., "#ff0000" or "#f00").
 *
 * @param value - The string to validate
 * @returns True if the value is a valid hex color
 */
export function isHex(value: string): value is `#${string}` {
  return /^#([0-9a-f]{3}){1,2}$/i.test(value)
}

/**
 * Validates hex color strings without hash (e.g., "ff0000" or "f00").
 *
 * @param value - The string to validate
 * @returns True if the value is a valid hex color without hash
 */
export function isHexWithoutHash(value: string): value is `#${string}` {
  return /^([0-9a-f]{3}){1,2}$/i.test(value)
}
