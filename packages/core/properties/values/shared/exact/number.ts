import { Unit } from "../../../constants"
import { ValueType } from "../../../constants"

export type NumberValue = {
  type: ValueType.EXACT
  value: number | { value: number; unit: Unit.NUMBER }
  restrictions?: {
    allowedValues?: number[]
    min?: number
    max?: number
    step?: number
  }
}
