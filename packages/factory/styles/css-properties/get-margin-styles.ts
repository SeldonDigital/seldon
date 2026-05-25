import { Properties } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { Theme } from "@seldon/core/themes/types"
import { getAbsoluteSizeCssValue } from "./get-absolute-size-css-value"
import { CSSObject } from "./types"

export function getMarginStyles({
  properties,
  theme,
}: {
  properties: Properties
  theme: Theme
}): CSSObject {
  const styles: CSSObject = {}

  if (properties.margin) {
    const top = resolveValue(properties.margin.top)
    const right = resolveValue(properties.margin.right)
    const bottom = resolveValue(properties.margin.bottom)
    const left = resolveValue(properties.margin.left)

    if (top) {
      styles.marginTop = getAbsoluteSizeCssValue(top, theme)
    }
    if (right) {
      styles.marginRight = getAbsoluteSizeCssValue(right, theme)
    }
    if (bottom) {
      styles.marginBottom = getAbsoluteSizeCssValue(bottom, theme)
    }
    if (left) {
      styles.marginLeft = getAbsoluteSizeCssValue(left, theme)
    }
  }

  return styles
}
