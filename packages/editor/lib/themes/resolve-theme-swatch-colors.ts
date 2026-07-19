import { ComputedTheme, ThemeSwatchKey } from "@seldon/core"
import { themeSwatchToCssBackground } from "@seldon/core/helpers/color/theme-swatch-to-css-background"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"

const SWATCH_KEYS: ThemeSwatchKey[] = [
  "@swatch.primary",
  "@swatch.swatch1",
  "@swatch.swatch2",
  "@swatch.swatch3",
  "@swatch.swatch4",
]

/**
 * Resolves the swatch cluster of a computed theme into background CSS colors,
 * ready to hand to the pure `ThemeSwatches` View. The five palette slots always
 * resolve to concrete swatches on a computed theme, so `transparent` only guards
 * the unreachable case of a colorspace the CSS helper does not support.
 */
export function resolveThemeSwatchColors(theme: ComputedTheme): string[] {
  return SWATCH_KEYS.map(
    (key) =>
      themeSwatchToCssBackground(getThemeOption(key, theme)) ?? "transparent",
  )
}
