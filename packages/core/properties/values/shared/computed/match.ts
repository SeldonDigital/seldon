import { ValueType } from "../../../constants"
import { ComputedFunction } from "./computed"

export type ComputedMatchValue = {
  type: ValueType.COMPUTED
  value: ComputedFunction.MATCH
}
