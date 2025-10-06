import {
  CornerValue,
  MarginSideValue,
  PaddingSideValue,
  Unit,
  ValueType,
} from "@seldon/core"
import { modulate } from "@seldon/core/helpers/math/modulate"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { Theme, ThemeMarginKey } from "@seldon/core/themes/types"
import { getCssValue } from "./get-css-value"

export function getAbsoluteSizeCssValue(
  value: MarginSideValue | PaddingSideValue | CornerValue,
  theme: Theme,
): string {
  if (value.type === ValueType.THEME_ORDINAL) {
    const themeValue = getThemeOption(value.value as ThemeMarginKey, theme)

    return String(
      getCssValue({
        type: ValueType.EXACT,
        value: {
          unit: Unit.REM,
          value: modulate({
            ratio: theme.core.ratio,
            size: theme.core.size,
            step: themeValue.parameters.step,
          }),
        },
      }),
    )
  }

  if (value.type === ValueType.COMPUTED) {
    throw new Error(
      `Parsing computed value errored in getAbsoluteSizeCssValue, this should have been computed in the compute function`,
    )
  }

  return String(getCssValue(value))
}
