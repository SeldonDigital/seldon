import { Theme, ThemeSwatchKey } from "@seldon/core"
import { themeSwatchToCssBackground } from "@seldon/core/helpers/color/theme-swatch-to-css-background"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { isSwatchToken } from "@seldon/core/themes/values"
import { SWATCH_FALLBACK_COLOR } from "../properties.bespoke"

const SWATCH_KEYS: ThemeSwatchKey[] = [
  "@swatch.primary",
  "@swatch.swatch1",
  "@swatch.swatch2",
  "@swatch.swatch3",
  "@swatch.swatch4",
]

const FALLBACK_COLOR = SWATCH_FALLBACK_COLOR

/**
 * Resolves the swatch cluster of a theme into background CSS colors, ready to
 * hand to the pure `ThemeSwatches` View. Non-swatch tokens fall back to a
 * neutral color so the cluster always renders five dots.
 */
export function resolveThemeSwatchColors(theme: Theme): string[] {
  return SWATCH_KEYS.map((key) => {
    const themeValue = getThemeOption(key, theme)
    const background = isSwatchToken(themeValue)
      ? themeSwatchToCssBackground(themeValue)
      : undefined
    return background ?? FALLBACK_COLOR
  })
}
