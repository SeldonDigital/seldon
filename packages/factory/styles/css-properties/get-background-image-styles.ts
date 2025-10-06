import {
  Properties,
  SingleBackgroundPositionValue,
  SingleBackgroundSizeValue,
} from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { Theme, ThemeBackground } from "@seldon/core/themes/types"
import { getBackgroundPositionStyle } from "./get-background-position-style"
import { getBackgroundSizeStyle } from "./get-background-size-style"
import { CSSObject } from "./types"

export function getBackgroundImageStyles({
  properties,
  theme,
}: {
  properties: Properties
  theme: Theme
}): CSSObject {
  const styles: CSSObject = {}
  const preset = resolveValue(properties.background?.preset)
  const themeBackground = preset
    ? (getThemeOption(preset.value, theme) as ThemeBackground)
    : undefined

  const image =
    resolveValue(properties.background?.image) ??
    resolveValue(themeBackground?.parameters.image)

  const repeat =
    resolveValue(properties.background?.repeat) ??
    resolveValue(themeBackground?.parameters.repeat)

  const position =
    resolveValue(properties.background?.position) ??
    resolveValue(themeBackground?.parameters.position)

  const size =
    resolveValue(properties.background?.size) ??
    resolveValue(themeBackground?.parameters.size)

  // Only apply if background.image is defined in the schema
  if (image && properties.background?.image) {
    styles.backgroundImage = `url(${image.value})`
  }

  // Only apply if background.repeat is defined in the schema
  if (repeat && properties.background?.repeat) {
    styles.backgroundRepeat = repeat.value
  }

  // Only apply if background.position is defined in the schema
  if (position && properties.background?.position) {
    if (
      typeof position.value === "object" &&
      "x" in position.value &&
      "y" in position.value
    ) {
      // Value is a DoubleAxisValue
      const { x, y } = position.value
      styles.backgroundPosition = `${x.value}${x.unit} ${y.value}${y.unit}`
    } else {
      styles.backgroundPosition = getBackgroundPositionStyle(
        position as SingleBackgroundPositionValue,
      )
    }
  }

  // Only apply if background.size is defined in the schema
  if (size && properties.background?.size) {
    if (
      typeof size.value === "object" &&
      "x" in size.value &&
      "y" in size.value
    ) {
      // Value is a DoubleAxisValue
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
