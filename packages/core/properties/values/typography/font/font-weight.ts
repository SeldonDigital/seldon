import { ThemeFontWeightKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { NumberValue } from "../../shared/number"

export type FontWeightValue = NumberValue | FontWeightThemeValue

export interface FontWeightThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeFontWeightKey
}
