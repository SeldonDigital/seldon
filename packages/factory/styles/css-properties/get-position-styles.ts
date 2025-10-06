import { Properties } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { Theme } from "@seldon/core/themes/types"
import { getAbsoluteSizeCssValue } from "./get-absolute-size-css-value"
import { CSSObject } from "./types"

export function getPositionStyles({
  properties,
  theme,
}: {
  properties: Properties
  theme: Theme
}): CSSObject {
  const styles: CSSObject = {}

  if (properties.position) {
    const top = resolveValue(properties.position.top)
    const right = resolveValue(properties.position.right)
    const bottom = resolveValue(properties.position.bottom)
    const left = resolveValue(properties.position.left)

    if (top) {
      styles.top = getAbsoluteSizeCssValue(top, theme)
    }

    if (right) {
      styles.right = getAbsoluteSizeCssValue(right, theme)
    }

    if (bottom) {
      styles.bottom = getAbsoluteSizeCssValue(bottom, theme)
    }

    if (left) {
      styles.left = getAbsoluteSizeCssValue(left, theme)
    }

    if (top || right || bottom || left) {
      styles.position = "absolute"
    }
  }
  return styles
}
