import { ThemeValueKey } from "../../themes/types"

/**
 * Validates if a string is a valid theme value key (e.g., "@swatch.primary").
 *
 * @param value - The string to validate
 * @returns True if the value is a valid theme value key
 */
export function isThemeValueKey(value: string): value is ThemeValueKey {
  return /^@[a-zA-Z0-9]+\.[a-z0-9\-]+$/i.test(value)
}
