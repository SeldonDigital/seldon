import { Placement, Properties, ValueType } from "@seldon/core"
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

  let hasInsets = false

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

    hasInsets = !!(top || right || bottom || left)
  }

  // An explicit `placement` sets the CSS position mode, so a frame can be
  // `relative` to anchor absolutely positioned children while still using its
  // flex `orientation`/`align`. With no placement, inset offsets still imply
  // `absolute` so a positioned frame keeps working without an explicit pick.
  const placement = resolveValue(properties.placement)
  const placementMode =
    placement?.type === ValueType.OPTION
      ? (placement.value as Placement)
      : undefined

  if (placementMode) {
    styles.position = placementMode
  } else if (hasInsets) {
    styles.position = "absolute"
  }

  return styles
}
