import {
  BackgroundPositionValue,
  Properties,
  SingleBackgroundSizeValue,
} from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { Theme, ThemeBackground } from "@seldon/core/themes/types"
import { getBackgroundPositionStyle } from "./get-background-position-style"
import { getBackgroundSizeStyle } from "./get-background-size-style"
import { getLayeredPaintLayer } from "./get-layered-paint-layer"
import { CSSObject } from "./types"

export function getBackgroundImageStyles({
  properties,
  theme,
}: {
  properties: Properties
  theme: Theme
}): CSSObject {
  const styles: CSSObject = {}
  const layer = getLayeredPaintLayer(properties, "background")
  if (!layer) return styles

  const preset = resolveValue(layer.preset)
  const themeBackground = preset
    ? (getThemeOption(preset.value, theme) as ThemeBackground)
    : undefined

  const image =
    resolveValue(layer.image) ??
    resolveValue(themeBackground?.parameters.image)

  const repeat =
    resolveValue(layer.repeat) ??
    resolveValue(themeBackground?.parameters.repeat)

  const position =
    resolveValue(layer.position) ??
    resolveValue(themeBackground?.parameters.position)

  const size =
    resolveValue(layer.size) ?? resolveValue(themeBackground?.parameters.size)

  if (image && layer.image) {
    styles.backgroundImage = `url(${image.value})`
  }

  if (repeat && layer.repeat) {
    styles.backgroundRepeat = repeat.value
  }

  if (position && layer.position) {
    if (
      typeof position.value === "object" &&
      "x" in position.value &&
      "y" in position.value
    ) {
      const { x, y } = position.value
      styles.backgroundPosition = `${x.value}${x.unit} ${y.value}${y.unit}`
    } else {
      styles.backgroundPosition = getBackgroundPositionStyle(
        position as BackgroundPositionValue,
      )
    }
  }

  if (size && layer.size) {
    if (
      typeof size.value === "object" &&
      "x" in size.value &&
      "y" in size.value
    ) {
      const { x, y } = size.value
      styles.backgroundSize = `${x.value}${x.unit} ${y.value}${y.unit}`
    } else {
      styles.backgroundSize = getBackgroundSizeStyle(
        size as SingleBackgroundSizeValue,
      )
    }
  }

  return styles
}
