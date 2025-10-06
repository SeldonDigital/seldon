import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { Theme, ThemeSwatchKey } from "@seldon/core/themes/types"
import { CSSObject } from "./types"

/**
 * Retrieves the theme color in CSS format based on the provided parameters.
 * @param {Object} options - The options for retrieving the theme color.
 * @param {ThemeSwatchKey} options.swatchKey - The key of the theme swatch.
 * @param {number | null} [options.opacity] - The optional opacity value for the color.
 * @param {Theme} options.theme - The theme object.
 * @returns {CSSObject["color"]} The theme color in CSS format.
 * @throws {Error} If the theme color type is invalid.
 */

export function getColorCSSValueFromSwatch({
  swatchKey,
  opacity,
  theme,
}: {
  swatchKey: ThemeSwatchKey
  opacity?: number | null
  theme: Theme
}): CSSObject["color"] {
  const themeValue = getThemeOption(swatchKey, theme)

  return HSLObjectToString(themeValue.value, opacity)
}
