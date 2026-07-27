import type { ValueType } from "../../../constants"
import type { ComputedFunction } from "./computed"

export type ComputedMatchColorValue = {
  type: ValueType.COMPUTED
  value: ComputedFunction.MATCH_COLOR
}
