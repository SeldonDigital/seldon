import { ThemeBorderKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"

export interface BorderPresetValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeBorderKey
}
