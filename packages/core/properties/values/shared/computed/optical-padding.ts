import { ValueType } from "../../../constants"
import { ComputedFunction } from "./computed"

export type ComputedOpticalPaddingValue = {
  type: ValueType.COMPUTED
  value: ComputedFunction.OPTICAL_PADDING
}
