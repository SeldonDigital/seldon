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
 * Validates HSL color strings (e.g., "hsl(120, 50%, 50%)").
 *
 * @param value - The string to validate
 * @returns True if the value is a valid HSL color
 */
export function isHSLString(value: string) {
  return /^hsl\(\d{1,3}(deg)?,?\s*(100|[1-9][0-9]?|[0-9])%?,?\s*(100|[1-9][0-9]?|[0-9])%?\)$/i.test(
    value,
  )
}

/**
 * Validates RGB color strings (e.g., "rgb(255, 0, 0)").
 *
 * @param value - The string to validate
 * @returns True if the value is a valid RGB color
 */
export function isRGBString(value: string) {
  return /^rgb\(\s*\d{1,3}(\s*,\s*|\s+)?\d{1,3}(\s*,\s*|\s+)?\d{1,3}\s*\)$/i.test(
    value,
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
