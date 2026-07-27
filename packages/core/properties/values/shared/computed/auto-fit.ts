import type { ValueType } from "../../../constants"
import type { ComputedFunction } from "./computed"

export type ComputedAutoFitValue = {
  type: ValueType.COMPUTED
  value: ComputedFunction.AUTO_FIT
}
