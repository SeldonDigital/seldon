import {
  CornerValue,
  MarginSideValue,
  PaddingSideValue,
  PositionSideValue,
  Unit,
  ValueType,
} from "@seldon/core"
import { modulate } from "@seldon/core/helpers/math/modulate"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { Theme, ThemeMarginKey } from "@seldon/core/themes/types"
import { isModulatedToken } from "@seldon/core/themes/types"

import { getCssValue } from "./get-css-value"

export function getAbsoluteSizeCssValue(
  value: MarginSideValue | PaddingSideValue | CornerValue | PositionSideValue,
  theme: Theme,
): string {
  if (value.type === ValueType.THEME_ORDINAL) {
    const themeValue = getThemeOption(value.value as ThemeMarginKey, theme)

    if (isModulatedToken(themeValue)) {
      return String(
        getCssValue({
          type: ValueType.EXACT,
          value: {
            unit: Unit.REM,
            value: modulate({
              ratio: theme.modulation.parameters.ratio,
              size: theme.modulation.parameters.baseSize,
              step: themeValue.parameters.step,
            }),
          },
        }),
      )
    }

    const { unit, value: exactValue } = themeValue.parameters
    const suffix = unit === Unit.PX ? "px" : unit === Unit.PERCENT ? "%" : "rem"
    return `${exactValue}${suffix}`
  }

  if (value.type === ValueType.COMPUTED) {
    throw new Error(
      `Parsing computed value errored in getAbsoluteSizeCssValue, this should have been computed in the compute function`,
    )
  }

  if (value.type === ValueType.OPTION) {
    return String(getCssValue(value))
  }

  return String(getCssValue(value))
}
