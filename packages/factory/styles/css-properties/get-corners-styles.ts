import { Properties } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { Theme } from "@seldon/core/themes/types"
import { getAbsoluteSizeCssValue } from "./get-absolute-size-css-value"
import { CSSObject } from "./types"

export function getCornersStyles({
  properties,
  theme,
}: {
  properties: Properties
  theme: Theme
}): CSSObject {
  const styles: CSSObject = {}

  if (!properties.corners) return styles

  const topRight = resolveValue(properties.corners.topRight)
  const bottomRight = resolveValue(properties.corners.bottomRight)
  const bottomLeft = resolveValue(properties.corners.bottomLeft)
  const topLeft = resolveValue(properties.corners.topLeft)

  if (topRight) {
    styles.borderTopRightRadius = getAbsoluteSizeCssValue(topRight, theme)
  }

  if (bottomRight) {
    styles.borderBottomRightRadius = getAbsoluteSizeCssValue(bottomRight, theme)
  }

  if (bottomLeft) {
    styles.borderBottomLeftRadius = getAbsoluteSizeCssValue(bottomLeft, theme)
  }

  if (topLeft) {
    styles.borderTopLeftRadius = getAbsoluteSizeCssValue(topLeft, theme)
  }

  return styles
}
