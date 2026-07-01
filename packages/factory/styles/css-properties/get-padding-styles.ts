import { Properties } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import type { ComputeContext } from "@seldon/core/properties/compute"
import { Theme } from "@seldon/core/themes/types"

import { getComputedCssValue } from "../computed-variables"
import { getAbsoluteSizeCssValue } from "./get-absolute-size-css-value"
import { CSSObject } from "./types"

type PaddingSide = "top" | "right" | "bottom" | "left"

const SIDE_TO_CSS_KEY: Record<PaddingSide, keyof CSSObject> = {
  top: "paddingTop",
  right: "paddingRight",
  bottom: "paddingBottom",
  left: "paddingLeft",
}

export function getPaddingStyles({
  properties,
  computeContext,
  theme,
  useThemeVariableReferences,
}: {
  properties: Properties
  computeContext?: ComputeContext
  theme: Theme
  useThemeVariableReferences?: boolean
}): CSSObject {
  const styles: CSSObject = {}

  if (properties.padding) {
    const padding = properties.padding
    const canTheme = useThemeVariableReferences && !!computeContext

    for (const side of ["top", "right", "bottom", "left"] as PaddingSide[]) {
      const value = resolveValue(padding[side])
      if (!value) continue

      const literal = getAbsoluteSizeCssValue(
        value,
        theme,
        useThemeVariableReferences,
      )

      const themed = canTheme
        ? getComputedCssValue({
            original: computeContext.properties.padding?.[side],
            context: computeContext,
            keys: { propertyKey: "padding", subPropertyKey: side },
          })
        : null

      ;(styles as Record<string, string | number>)[SIDE_TO_CSS_KEY[side]] =
        themed ?? literal
    }
  }
  return styles
}
