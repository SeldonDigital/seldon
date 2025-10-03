import { ThemeFontKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"

export interface FontPresetValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeFontKey
}
