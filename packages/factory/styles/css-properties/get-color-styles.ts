import type { Properties } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { isGradientBackgroundKind } from "@seldon/core/properties/values/appearance/background/background-kind"

import { getComputedCssValue } from "../computed-variables"
import { StyleGenerationContext } from "../types"
import {
  applyTransformsToColorReference,
  getColorCSSValue,
} from "./get-color-css-value"
import { getLayeredPaintLayers } from "./get-layered-paint-layer"
import { CSSObject } from "./types"

/** True when any background layer paints a gradient that clips to text. */
function hasGradientBackground(properties: Properties): boolean {
  return getLayeredPaintLayers(properties, "background").some((layer) => {
    const kind = resolveValue(layer.kind)
    if (kind && typeof kind.value === "string") {
      return isGradientBackgroundKind(kind.value)
    }
    return !!resolveValue(layer.preset) || !!resolveValue(layer.startColor)
  })
}

export function getColorStyles({
  properties,
  computeContext,
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
      const themed =
        useThemeVariableReferences && computeContext
          ? getComputedCssValue({
              original: computeContext.properties.color,
              context: computeContext,
            })
          : null
      // A computed color themes through its `var(--sdn-...)` reference, which
      // carries no brightness. Ride the same brightness transform onto the
      // reference so a brightness override still applies while the color swaps
      // per theme, matching the resolved `colorValue` and the canvas render.
      const brightnessNum =
        resolveValue(properties.brightness)?.value.value ?? 0
      const themedColor = themed
        ? applyTransformsToColorReference(themed, brightnessNum, 100)
        : null
      styles.color = themedColor ?? colorValue
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
      const themed =
        useThemeVariableReferences && computeContext
          ? getComputedCssValue({
              original: computeContext.properties.accentColor,
              context: computeContext,
            })
          : null
      styles.accentColor = themed ?? accentColorValue
    }
  }

  return styles
}
