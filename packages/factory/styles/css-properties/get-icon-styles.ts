import { ValueType } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"

import { StyleGenerationContext } from "../types"
import { getColorCSSValue } from "./get-color-css-value"
import { getSizeCSSValue } from "./get-size-css-value"
import { CSSObject } from "./types"

export function getIconStyles({
  properties,
  parentContext,
  theme,
  useThemeVariableReferences,
}: StyleGenerationContext): CSSObject {
  const styles: CSSObject = {}

  const symbol = resolveValue(properties.symbol)

  if (symbol && properties.size && properties.size.type !== ValueType.EMPTY) {
    styles.fontSize = getSizeCSSValue({
      size: resolveValue(properties.size) ?? theme.iconSet.defaultSize,
      parentContext,
      theme,
      useThemeVariableReferences,
    })
  }

  if (symbol && properties.color && properties.color.type !== ValueType.EMPTY) {
    const resolvedColor = resolveValue(properties.color)
    if (resolvedColor) {
      styles.color = getColorCSSValue({
        color: resolvedColor,
        brightness: resolveValue(properties.brightness),
        theme,
        useThemeVariableReferences,
      })
    }
  }

  return styles
}
