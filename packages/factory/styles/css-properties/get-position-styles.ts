import { Properties } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { Theme } from "@seldon/core/themes/types"

import { getAbsoluteSizeCssValue } from "./get-absolute-size-css-value"
import { CSSObject } from "./types"

export function getPositionStyles({
  properties,
  theme,
  useThemeVariableReferences,
}: {
  properties: Properties
  theme: Theme
  useThemeVariableReferences?: boolean
}): CSSObject {
  const styles: CSSObject = {}

  if (properties.position) {
    const top = resolveValue(properties.position.top)
    const right = resolveValue(properties.position.right)
    const bottom = resolveValue(properties.position.bottom)
    const left = resolveValue(properties.position.left)

    if (top) {
      styles.top = getAbsoluteSizeCssValue(
        top,
        theme,
        useThemeVariableReferences,
      )
    }

    if (right) {
      styles.right = getAbsoluteSizeCssValue(
        right,
        theme,
        useThemeVariableReferences,
      )
    }

    if (bottom) {
      styles.bottom = getAbsoluteSizeCssValue(
        bottom,
        theme,
        useThemeVariableReferences,
      )
    }

    if (left) {
      styles.left = getAbsoluteSizeCssValue(
        left,
        theme,
        useThemeVariableReferences,
      )
    }

    if (top || right || bottom || left) {
      styles.position = "absolute"
    }
  }
  return styles
}
