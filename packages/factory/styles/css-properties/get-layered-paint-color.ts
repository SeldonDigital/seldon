import { ColorValue, EmptyValue, PercentageValue } from "@seldon/core"
import { Theme } from "@seldon/core/themes/types"

import { getColorCSSValue } from "./get-color-css-value"

/**
 * Resolves a layered paint color (background, gradient stop, or shadow) to CSS.
 *
 * Live rendering always receives a resolved literal color. The code export sets
 * `useThemeVariableReferences` so a swatch becomes a `var(--sdn-swatch-*)`
 * reference that tracks the exported theme stylesheet. An opacity-only swatch
 * wraps that reference in `color-mix(... transparent)`. A brightness transform
 * cannot live in a variable, so those still resolve to a literal.
 */
export function getLayeredPaintColor({
  color,
  brightness,
  opacity,
  theme,
  useThemeVariableReferences = false,
}: {
  color: ColorValue | EmptyValue
  brightness?: PercentageValue | EmptyValue
  opacity?: PercentageValue | EmptyValue | number
  theme: Theme
  useThemeVariableReferences?: boolean
}): string {
  return getColorCSSValue({
    color,
    brightness,
    opacity,
    theme,
    useThemeVariableReferences,
  })
}
