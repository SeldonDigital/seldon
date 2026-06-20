import { Theme } from "../../themes/types"
import { isFontFamilyToken } from "../../themes/values"
import { isThemeValueKey } from "../validation/theme"
import { getThemeOption } from "./get-theme-option"

/**
 * Gets the friendly display name for a theme value
 * @param key - The theme value key (e.g., "@fontSize.medium") or raw value name (e.g., "medium")
 * @param theme - The theme object to retrieve the name from
 * @returns Friendly display name for the theme value
 */
export function getThemeValueName(key: string, theme: Theme): string {
  if (!isThemeValueKey(key)) {
    // Handle raw value names without @ prefix
    return formatRawValueName(key)
  }

  try {
    const option = getThemeOption(key, theme)

    // fontFamily returns string directly
    if (typeof option === "string") {
      return option
    }

    if (isFontFamilyToken(option)) {
      const slot = key.split(".").pop()
      if (slot === "primary" || slot === "secondary") {
        return `${option.parameters} · ${formatRawValueName(slot)}`
      }
      return option.parameters
    }

    // All other theme options have name property
    if (typeof option === "object" && option !== null && "name" in option) {
      const name = (option as { name?: string }).name
      if (typeof name === "string") return name
    }

    // Fallback for unexpected option types
    return formatRawValueName(key.split(".").pop() || key)
  } catch {
    // Fallback if theme option lookup fails
    return formatRawValueName(key.split(".").pop() || key)
  }
}

/**
 * Formats raw value names (without @ prefix) into friendly display names
 * Converts camelCase to PascalCase (e.g., "fontSize" → "FontSize")
 * @param valueName - The raw value name to format
 * @returns Formatted display name
 */
function formatRawValueName(valueName: string): string {
  if (!valueName) return valueName

  // Handle malformed theme keys that start with @ but don't have a dot
  // Preserve them as-is (e.g., "@fontSize" → "@fontSize")
  if (valueName.startsWith("@")) {
    return valueName
  }

  // Handle custom values
  if (valueName.startsWith("custom")) {
    const number = valueName.replace("custom", "")
    return `Custom ${number}`
  }

  // Convert camelCase to PascalCase (capitalize first letter, keep rest as-is)
  // e.g., "fontSize" → "FontSize", "lineHeight" → "LineHeight"
  const camelCaseRegex = /^[a-z]/
  if (camelCaseRegex.test(valueName)) {
    return valueName.charAt(0).toUpperCase() + valueName.slice(1)
  }

  // If already starts with uppercase, return as-is
  return valueName
}
