import { Theme } from "../../themes/types"
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

    // All other theme options have name property
    if (typeof option === "object" && option !== null && "name" in option) {
      return option.name
    }

    // Fallback for unexpected option types
    return formatRawValueName(key.split(".").pop() || key)
  } catch (error) {
    // Fallback if theme option lookup fails
    return formatRawValueName(key.split(".").pop() || key)
  }
}

/**
 * Formats raw value names (without @ prefix) into friendly display names
 * @param valueName - The raw value name to format
 * @returns Formatted display name
 */
function formatRawValueName(valueName: string): string {
  if (valueName.startsWith("custom")) {
    const number = valueName.replace("custom", "")
    return `Custom ${number}`
  }
  return valueName.charAt(0).toUpperCase() + valueName.slice(1)
}
