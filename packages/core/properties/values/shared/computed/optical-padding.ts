import type { ValueType } from "../../../constants"
import type { ComputedFunction } from "./computed"

export type ComputedOpticalPaddingValue = {
  type: ValueType.COMPUTED
  value: ComputedFunction.OPTICAL_PADDING
}
