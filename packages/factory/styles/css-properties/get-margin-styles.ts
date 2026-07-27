import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"

import { getAbsoluteSizeCssValue } from "./get-absolute-size-css-value"

import type { CSSObject } from "./types"
import type { Properties } from "@seldon/core"
import type { Theme } from "@seldon/core/themes/types"

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
      styles.marginTop = getAbsoluteSizeCssValue(top, theme, useThemeVariableReferences)
    }

    if (right) {
      styles.marginInlineEnd = getAbsoluteSizeCssValue(right, theme, useThemeVariableReferences)
    }

    if (bottom) {
      styles.marginBottom = getAbsoluteSizeCssValue(bottom, theme, useThemeVariableReferences)
    }

    if (left) {
      styles.marginInlineStart = getAbsoluteSizeCssValue(left, theme, useThemeVariableReferences)
    }
  }

  return styles
}
