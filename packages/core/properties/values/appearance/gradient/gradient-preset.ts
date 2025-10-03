import { ThemeGradientKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"

export interface GradientPresetValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeGradientKey
}
