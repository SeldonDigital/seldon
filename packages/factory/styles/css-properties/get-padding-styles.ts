import { Properties } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { Theme } from "@seldon/core/themes/types"
import { getAbsoluteSizeCssValue } from "./get-absolute-size-css-value"
import { CSSObject } from "./types"

export function getPaddingStyles({
  properties,
  theme,
}: {
  properties: Properties
  theme: Theme
}): CSSObject {
  const styles: CSSObject = {}

  if (properties.padding) {
    const top = resolveValue(properties.padding.top)
    const right = resolveValue(properties.padding.right)
    const bottom = resolveValue(properties.padding.bottom)
    const left = resolveValue(properties.padding.left)

    if (top) {
      styles.paddingTop = getAbsoluteSizeCssValue(top, theme)
    }

    if (right) {
      styles.paddingRight = getAbsoluteSizeCssValue(right, theme)
    }

    if (bottom) {
      styles.paddingBottom = getAbsoluteSizeCssValue(bottom, theme)
    }

    if (left) {
      styles.paddingLeft = getAbsoluteSizeCssValue(left, theme)
    }
  }
  return styles
}
