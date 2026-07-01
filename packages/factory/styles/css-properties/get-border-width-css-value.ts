import { BorderWidth, BorderWidthValue, ValueType } from "@seldon/core"
import { resolveBorderWidth } from "@seldon/core/helpers/resolution/resolve-border-width"
import { Theme } from "@seldon/core/themes/types"

import { getCssValue } from "./get-css-value"
import { getThemeTokenVarReference } from "./get-theme-token-reference"
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
  useThemeVariableReferences?: boolean,
): CSSObject["borderWidth"] {
  if (borderWidth.value === BorderWidth.HAIRLINE) {
    return "var(--hairline)"
  }

  if (
    useThemeVariableReferences &&
    borderWidth.type === ValueType.THEME_ORDINAL
  ) {
    const reference = getThemeTokenVarReference(borderWidth.value)
    if (reference) return reference
  }

  const resolvedBorderWidth = resolveBorderWidth({
    borderWidth,
    theme,
  })

  return getCssValue(resolvedBorderWidth) as CSSObject["borderWidth"]
}
