import { ValueType } from "../../../constants"
import { ComputedFunction } from "./computed"

export type ComputedHighContrastValue = {
  type: ValueType.COMPUTED
  value: ComputedFunction.HIGH_CONTRAST_COLOR
}
