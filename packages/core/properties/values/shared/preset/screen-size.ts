import { ValueType } from "../../../constants"
import { ScreenSize } from "../../../values"

export interface ScreenSizePresetValue {
  type: ValueType.PRESET
  value: ScreenSize
}
