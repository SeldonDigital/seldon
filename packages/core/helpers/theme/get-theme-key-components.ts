import { ThemeOptionId, ThemeSection, ThemeValueKey } from "../../themes/types"
import { isThemeValueKey } from "../validation/theme"

/**
 * Parses a theme value key into its section and option components
 *
 * @param key - The theme value key to parse (e.g., "@fontSize.medium", "@swatch.primary")
 * @returns An object containing the section and optionId components
 * @throws Error if the key is not a valid theme value key
 */
export function getThemeKeyComponents(key: ThemeValueKey): {
  section: ThemeSection
  optionId: ThemeOptionId
} {
  if (!isThemeValueKey(key)) {
    throw new Error(`${key} is not a valid theme value`)
  }

  const [section, optionId] = key.substring(1).split(".")

  return {
    section: section as ThemeSection,
    optionId: optionId as ThemeOptionId,
  }
}
