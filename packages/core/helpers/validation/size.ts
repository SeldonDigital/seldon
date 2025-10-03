import { isNumber } from "./number"
import { isPercentage } from "./percentage"
import { isThemeValueKey } from "./theme"

/**
 * Validates if a string is a valid size value (px, rem, number, or theme value).
 *
 * @param value - The string to validate
 * @returns True if the value is a valid size format
 */
export function isValidSize(value: string) {
  return (
    isPx(value) || isRem(value) || isThemeValueKey(value) || isNumber(value)
  )
}

/**
 * Validates if a string is a valid position value (px, rem, or percentage).
 *
 * @param value - The string to validate
 * @returns True if the value is a valid position format
 */
export function isValidPositionValue(value: string) {
  return isPx(value) || isRem(value) || isPercentage(value)
}

/**
 * Validates if a string is a valid pixel value (e.g., "16px").
 *
 * @param value - The string to validate
 * @returns True if the value is a valid pixel value
 */
export function isPx(value: string) {
  return value.toLowerCase().endsWith("px") && !isNaN(parseFloat(value))
}

/**
 * Validates if a string is a valid rem value (e.g., "1.5rem").
 *
 * @param value - The string to validate
 * @returns True if the value is a valid rem value
 */
export function isRem(value: string) {
  return value.toLowerCase().endsWith("rem") && !isNaN(parseFloat(value))
}
