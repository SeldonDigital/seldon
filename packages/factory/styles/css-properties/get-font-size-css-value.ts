import { FontSizeValue, Theme } from "@seldon/core"
import { resolveFontSize } from "@seldon/core/helpers/resolution/resolve-font-size"
import { getCssValue } from "./get-css-value"

/**
 * Retrieves the CSS font size value based on the provided font size value and theme.
 *
 * @param {FontSizeValue} params.fontSize - The font size value to convert to CSS font size.
 * @param {Theme} params.theme - The theme object containing font size options.
 * @param {Properties} params.parentProperties - The parent properties object.
 *
 * @returns The CSS font size value.
 */
export function getFontSizeCSSValue({
  fontSize,
  theme,
}: {
  fontSize: FontSizeValue
  theme: Theme
}) {
  const resolvedFontSize = resolveFontSize({
    fontSize,
    theme,
  })

  return getCssValue(resolvedFontSize)
}
