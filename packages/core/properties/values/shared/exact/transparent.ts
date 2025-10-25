import { ValueType } from "../../../constants"
import { Color } from "../../appearance/color"

export interface TransparentValue {
  type: ValueType.PRESET
  value: Color.TRANSPARENT
}
