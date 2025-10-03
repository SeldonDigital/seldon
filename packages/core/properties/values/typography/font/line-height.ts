import { ThemeLineHeightKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { NumberValue } from "../../shared/number"
import { PercentageValue } from "../../shared/percentage"
import { PixelValue } from "../../shared/pixel"
import { RemValue } from "../../shared/rem"

export type LineHeightThemeValue = {
  type: ValueType.THEME_ORDINAL
  value: ThemeLineHeightKey
}

export type LineHeightValue =
  | PixelValue
  | RemValue
  | PercentageValue
  | NumberValue
  | LineHeightThemeValue
