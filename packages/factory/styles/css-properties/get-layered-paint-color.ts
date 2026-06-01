import { ColorValue, EmptyValue, PercentageValue, ValueType } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { Theme } from "@seldon/core/themes/types"
import { getColorCSSValue } from "./get-color-css-value"
import { getThemeSwatchVarReference } from "./get-theme-swatch-names"

/**
 * Resolves a layered paint color (background, gradient stop, or shadow) to CSS.
 *
 * Live rendering always receives a resolved literal color. The code export sets
 * `useThemeVariableReferences` so a plain swatch with no brightness or opacity
 * adjustment becomes a `var(--sdn-...swatch-*)` reference that tracks the
 * exported theme stylesheet. A CSS variable cannot carry a brightness or
 * opacity transform, so adjusted colors still resolve to a literal.
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
  if (useThemeVariableReferences) {
    const brightnessNum =
      typeof brightness === "number"
        ? brightness
        : (resolveValue(brightness)?.value.value ?? 0)

    const opacityNum =
      typeof opacity === "number"
        ? opacity
        : (resolveValue(opacity)?.value.value ?? 100)

    const isPlainSwatch =
      !!color &&
      typeof color === "object" &&
      color.type === ValueType.THEME_CATEGORICAL &&
      brightnessNum === 0 &&
      opacityNum === 100

    if (isPlainSwatch) {
      const reference = getThemeSwatchVarReference(
        String((color as { value: unknown }).value),
        theme,
      )
      if (reference) return reference
    }
  }

  return getColorCSSValue({ color, brightness, opacity, theme })
}
