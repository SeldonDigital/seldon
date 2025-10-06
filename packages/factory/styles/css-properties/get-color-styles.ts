import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { StyleGenerationContext } from "../types"
import { getColorCSSValue } from "./get-color-css-value"
import { CSSObject } from "./types"

export function getColorStyles({
  properties,
  theme,
}: StyleGenerationContext): CSSObject {
  const styles: CSSObject = {}

  // Texts may have a gradient in which case the color should not be set
  // Icon colors are set using getIconStyles
  if (!properties.symbol && !properties.gradient && properties.color) {
    styles.color = getColorCSSValue({
      color: properties.color,
      brightness: resolveValue(properties.brightness),
      theme,
    })
  }

  if (properties.accentColor) {
    styles.accentColor = getColorCSSValue({
      color: properties.accentColor,
      theme,
    })
  }

  return styles
}
