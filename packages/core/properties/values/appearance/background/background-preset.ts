import { ThemeBackgroundKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"

export interface BackgroundPresetValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeBackgroundKey
}
