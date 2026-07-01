import type { Properties } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { BackgroundKind } from "@seldon/core/properties/values/appearance/background/background-kind"

import { StyleGenerationContext } from "../types"
import { getColorCSSValue } from "./get-color-css-value"
import { getLayeredPaintLayers } from "./get-layered-paint-layer"
import { CSSObject } from "./types"

/** True when any background layer paints a gradient that clips to text. */
function hasGradientBackground(properties: Properties): boolean {
  return getLayeredPaintLayers(properties, "background").some((layer) => {
    const kind = resolveValue(layer.kind)
    if (kind && typeof kind.value === "string") {
      return kind.value === BackgroundKind.GRADIENT
    }
    return !!resolveValue(layer.preset) || !!resolveValue(layer.startColor)
  })
}

export function getColorStyles({
  properties,
  theme,
  useThemeVariableReferences,
}: StyleGenerationContext): CSSObject {
  const styles: CSSObject = {}

  // Texts may have a gradient in which case the color should not be set
  // Icon colors are set using getIconStyles
  if (
    !properties.symbol &&
    !hasGradientBackground(properties) &&
    properties.color
  ) {
    const colorValue = getColorCSSValue({
      color: properties.color,
      brightness: resolveValue(properties.brightness),
      theme,
      useThemeVariableReferences,
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
      useThemeVariableReferences,
    })
    // Only set the accent color if it's not transparent (which indicates an invalid color)
    if (accentColorValue !== "transparent") {
      styles.accentColor = accentColorValue
    }
  }

  return styles
}
