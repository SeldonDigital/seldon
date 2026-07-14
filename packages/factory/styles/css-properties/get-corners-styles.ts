import { Properties } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { Theme } from "@seldon/core/themes/types"

import { getAbsoluteSizeCssValue } from "./get-absolute-size-css-value"
import { CSSObject } from "./types"

export function getCornersStyles({
  properties,
  theme,
  useThemeVariableReferences,
}: {
  properties: Properties
  theme: Theme
  useThemeVariableReferences?: boolean
}): CSSObject {
  const styles: CSSObject = {}

  if (!properties.corners) return styles

  const topRight = resolveValue(properties.corners.topRight)
  const bottomRight = resolveValue(properties.corners.bottomRight)
  const bottomLeft = resolveValue(properties.corners.bottomLeft)
  const topLeft = resolveValue(properties.corners.topLeft)

  if (topRight) {
    styles.borderTopRightRadius = getAbsoluteSizeCssValue(
      topRight,
      theme,
      useThemeVariableReferences,
    )
  }

  if (bottomRight) {
    styles.borderBottomRightRadius = getAbsoluteSizeCssValue(
      bottomRight,
      theme,
      useThemeVariableReferences,
    )
  }

  if (bottomLeft) {
    styles.borderBottomLeftRadius = getAbsoluteSizeCssValue(
      bottomLeft,
      theme,
      useThemeVariableReferences,
    )
  }

  if (topLeft) {
    styles.borderTopLeftRadius = getAbsoluteSizeCssValue(
      topLeft,
      theme,
      useThemeVariableReferences,
    )
  }

  return styles
}
