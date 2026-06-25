import { ValueType } from "../../../constants"
import { ComputedFunction } from "./computed"

export type ComputedMatchColorValue = {
  type: ValueType.COMPUTED
  value: ComputedFunction.MATCH_COLOR
}
