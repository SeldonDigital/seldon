import { ValueType } from "../../../constants"
import { GradientType } from "../../../constants/gradient-types"

export interface GradientTypeValue {
  type: ValueType.PRESET
  value: GradientType
}
