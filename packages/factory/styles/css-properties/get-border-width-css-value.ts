import { BorderWidth, BorderWidthValue } from "@seldon/core"
import { resolveBorderWidth } from "@seldon/core/helpers/resolution/resolve-border-width"
import { Theme } from "@seldon/core/themes/types"
import { getCssValue } from "./get-css-value"
import { CSSObject } from "./types"

/**
 * Retrieves the CSS border width value based on the provided border width value and theme.
 *
 * @param {BorderWidthValue} params.borderWidth - The border width value to convert to CSS border width.
 * @param {Theme} params.theme - The theme object containing border width options.
 *
 * @returns The CSS border width value.
 */
export function getBorderWidthCSSValue(
  borderWidth: BorderWidthValue,
  theme: Theme,
): CSSObject["borderWidth"] {
  if (borderWidth.value === BorderWidth.HAIRLINE) {
    return "var(--hairline)"
  }

  const resolvedBorderWidth = resolveBorderWidth({
    borderWidth,
    theme,
  })

  return getCssValue(resolvedBorderWidth) as CSSObject["borderWidth"]
}
