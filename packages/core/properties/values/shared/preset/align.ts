import { ValueType } from "../../../constants"
import { Align } from "../../layout/align"

export interface AlignPresetValue {
  type: ValueType.PRESET
  value: Align
}
