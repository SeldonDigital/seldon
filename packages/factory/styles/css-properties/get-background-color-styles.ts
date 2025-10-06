import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { StyleGenerationContext } from "../types"
import { getColorCSSValue } from "./get-color-css-value"
import { CSSObject } from "./types"

export function getBackgroundColorStyles({
  properties,
  theme,
}: StyleGenerationContext): CSSObject {
  const styles: CSSObject = {}
  const preset = resolveValue(properties.background?.preset)
  const themeBackground = preset
    ? getThemeOption(preset.value, theme)
    : undefined

  const opacity =
    resolveValue(properties.background?.opacity) ??
    resolveValue(themeBackground?.parameters?.opacity)

  const brightness =
    resolveValue(properties.background?.brightness) ??
    resolveValue(themeBackground?.parameters?.brightness)

  const color =
    resolveValue(properties.background?.color) ??
    resolveValue(themeBackground?.parameters?.color)

  // Only apply if background.color is defined in the schema
  if (color && properties.background?.color) {
    styles.backgroundColor = getColorCSSValue({
      color,
      brightness,
      opacity,
      theme: theme,
    })
  }

  return styles
}
