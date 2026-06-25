import { ValueType } from "../../../constants"
import { ComputedFunction } from "./computed"

export type ComputedAutoFitValue = {
  type: ValueType.COMPUTED
  value: ComputedFunction.AUTO_FIT
}
