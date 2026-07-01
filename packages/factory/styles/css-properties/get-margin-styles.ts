import { Properties } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { Theme } from "@seldon/core/themes/types"

import { getAbsoluteSizeCssValue } from "./get-absolute-size-css-value"
import { CSSObject } from "./types"

export function getMarginStyles({
  properties,
  theme,
  useThemeVariableReferences,
}: {
  properties: Properties
  theme: Theme
  useThemeVariableReferences?: boolean
}): CSSObject {
  const styles: CSSObject = {}

  if (properties.margin) {
    const top = resolveValue(properties.margin.top)
    const right = resolveValue(properties.margin.right)
    const bottom = resolveValue(properties.margin.bottom)
    const left = resolveValue(properties.margin.left)

    if (top) {
      styles.marginTop = getAbsoluteSizeCssValue(
        top,
        theme,
        useThemeVariableReferences,
      )
    }
    if (right) {
      styles.marginRight = getAbsoluteSizeCssValue(
        right,
        theme,
        useThemeVariableReferences,
      )
    }
    if (bottom) {
      styles.marginBottom = getAbsoluteSizeCssValue(
        bottom,
        theme,
        useThemeVariableReferences,
      )
    }
    if (left) {
      styles.marginLeft = getAbsoluteSizeCssValue(
        left,
        theme,
        useThemeVariableReferences,
      )
    }
  }

  return styles
}
