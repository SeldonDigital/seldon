import { Properties } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { StyleGenerationContext } from "../types"
import { getColorCSSValue } from "./get-color-css-value"
import { getLayeredPaintLayer } from "./get-layered-paint-layer"
import { CSSObject } from "./types"

export function getBackgroundColorStyles({
  properties,
  theme,
}: StyleGenerationContext): CSSObject {
  const styles: CSSObject = {}
  const layer = getLayeredPaintLayer(properties, "background")
  if (!layer) return styles

  const preset = resolveValue(layer.preset)
  const themeBackground = preset
    ? getThemeOption(preset.value, theme)
    : undefined

  const opacity =
    resolveValue(layer.opacity) ??
    resolveValue(themeBackground?.parameters?.opacity)

  const brightness =
    resolveValue(layer.brightness) ??
    resolveValue(themeBackground?.parameters?.brightness)

  const color =
    resolveValue(layer.color) ?? resolveValue(themeBackground?.parameters?.color)

  if (color && layer.color) {
    styles.backgroundColor = getColorCSSValue({
      color,
      brightness,
      opacity,
      theme: theme,
    })
  }

  return styles
}
