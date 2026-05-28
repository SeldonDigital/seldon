import { themeSwatchToColorValue } from "@seldon/core/helpers/color/theme-swatch-to-color-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { Theme, ThemeSwatchKey } from "@seldon/core/themes/types"
import { getColorCSSValue } from "./get-color-css-value"
import { CSSObject } from "./types"

/**
 * Retrieves the theme color in CSS format based on the provided parameters.
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
  const swatch = getThemeOption(swatchKey, theme)

  return getColorCSSValue({
    color: themeSwatchToColorValue(swatch),
    opacity,
    theme,
  })
}
