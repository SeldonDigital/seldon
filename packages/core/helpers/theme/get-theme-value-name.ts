import { Theme } from "../../themes/types"
import { isFontFamilyToken } from "../../themes/values"
import { formatPresetValue } from "../properties/format-preset-value"
import { isThemeValueKey } from "../validation/theme"
import { parseThemeRef } from "./get-theme-key-components"
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
      const slot = parseThemeRef(key)?.optionId
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
    return formatRawValueName(parseThemeRef(key)?.optionId ?? key)
  } catch {
    // Fallback if theme option lookup fails
    return formatRawValueName(parseThemeRef(key)?.optionId ?? key)
  }
}

/**
 * Formats raw value names into friendly display names via
 * {@link formatPresetValue}. Malformed theme keys that still carry an `@`
 * prefix (e.g. `@fontSize` without a dot) pass through unchanged.
 */
function formatRawValueName(valueName: string): string {
  if (valueName.startsWith("@")) {
    return valueName
  }

  return formatPresetValue(valueName)
}
