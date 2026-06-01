import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { StyleGenerationContext } from "../types"
import { getLayeredPaintColor } from "./get-layered-paint-color"
import { getLayeredPaintLayers } from "./get-layered-paint-layer"
import { CSSObject } from "./types"

export function getBackgroundColorStyles({
  properties,
  theme,
}: StyleGenerationContext): CSSObject {
  const styles: CSSObject = {}
  const layers = getLayeredPaintLayers(properties, "background")
  if (layers.length === 0) return styles

  // The bottom-most layer paints the element's solid background color.
  const layer = layers[layers.length - 1]

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
    styles.backgroundColor = getLayeredPaintColor({
      color,
      brightness,
      opacity,
      theme,
    })
  }

  return styles
}
