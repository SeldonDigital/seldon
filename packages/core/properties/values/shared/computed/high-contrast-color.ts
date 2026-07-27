import type { ValueType } from "../../../constants"
import type { ComputedFunction } from "./computed"

export type ComputedHighContrastValue = {
  type: ValueType.COMPUTED
  value: ComputedFunction.HIGH_CONTRAST_COLOR
}
