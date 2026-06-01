import { ColorValue, EmptyValue, PercentageValue, ValueType } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { Theme } from "@seldon/core/themes/types"
import { getColorCSSValue } from "./get-color-css-value"
import { getThemeSwatchVarReference } from "./get-theme-swatch-names"

/**
 * Resolves a layered paint color (background, gradient stop, or shadow) to CSS.
 *
 * When the color is a plain swatch reference with no brightness or opacity
 * adjustment, it returns the theme `var(--sdn-...swatch-*)` reference so the
 * exported CSS tracks the theme. Otherwise it falls back to a resolved literal,
 * since a CSS variable cannot carry a brightness or opacity transform.
 */
export function getLayeredPaintColor({
  color,
  brightness,
  opacity,
  theme,
}: {
  color: ColorValue | EmptyValue
  brightness?: PercentageValue | EmptyValue
  opacity?: PercentageValue | EmptyValue | number
  theme: Theme
}): string {
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

  return getColorCSSValue({ color, brightness, opacity, theme })
}
