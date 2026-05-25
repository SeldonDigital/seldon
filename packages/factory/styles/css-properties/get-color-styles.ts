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
    const colorValue = getColorCSSValue({
      color: properties.color,
      brightness: resolveValue(properties.brightness),
      theme,
    })
    // Only set the color if it's not transparent (which indicates an invalid color)
    if (colorValue !== "transparent") {
      styles.color = colorValue
    }
  }

  if (properties.accentColor) {
    const accentColorValue = getColorCSSValue({
      color: properties.accentColor,
      theme,
    })
    // Only set the accent color if it's not transparent (which indicates an invalid color)
    if (accentColorValue !== "transparent") {
      styles.accentColor = accentColorValue
    }
  }

  return styles
}
