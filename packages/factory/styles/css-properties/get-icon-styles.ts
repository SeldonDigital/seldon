import { ValueType } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"

import { getComputedCssValue } from "../computed-variables"
import { StyleGenerationContext } from "../types"
import { getColorCSSValue } from "./get-color-css-value"
import { getSizeCSSValue } from "./get-size-css-value"
import { CSSObject } from "./types"

export function getIconStyles({
  properties,
  computeContext,
  parentContext,
  theme,
  useThemeVariableReferences,
}: StyleGenerationContext): CSSObject {
  const styles: CSSObject = {}

  const symbol = resolveValue(properties.symbol)
  const canTheme = useThemeVariableReferences && !!computeContext

  if (symbol && properties.size && properties.size.type !== ValueType.EMPTY) {
    const fontSize = getSizeCSSValue({
      size: resolveValue(properties.size) ?? theme.iconSet.defaultSize,
      parentContext,
      theme,
      useThemeVariableReferences,
    })
    const themed = canTheme
      ? getComputedCssValue({
          original: computeContext.properties.size,
          context: computeContext,
        })
      : null
    styles.fontSize = themed ?? fontSize
  }

  if (symbol && properties.color && properties.color.type !== ValueType.EMPTY) {
    const resolvedColor = resolveValue(properties.color)
    if (resolvedColor) {
      const colorValue = getColorCSSValue({
        color: resolvedColor,
        brightness: resolveValue(properties.brightness),
        theme,
        useThemeVariableReferences,
      })
      const themed = canTheme
        ? getComputedCssValue({
            original: computeContext.properties.color,
            context: computeContext,
          })
        : null
      styles.color = themed ?? colorValue
    }
  }

  return styles
}
