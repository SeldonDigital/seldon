import { ValueType } from "../../constants"
import { Color } from "../../constants/colors"

export interface TransparentValue {
  type: ValueType.PRESET
  value: Color.TRANSPARENT
}
