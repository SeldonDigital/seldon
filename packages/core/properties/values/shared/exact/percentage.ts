import { Unit } from "../../../constants"
import { ValueType } from "../../../constants"

export type PercentageValue = {
  type: ValueType.EXACT
  value: { value: number; unit: Unit.PERCENT }
  restrictions?: {
    min?: number
    max?: number
    step?: number
  }
}
