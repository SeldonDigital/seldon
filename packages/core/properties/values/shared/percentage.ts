import { Unit, ValueType } from "../../constants"

export type PercentageValue = {
  type: ValueType.EXACT
  value: { value: number; unit: Unit.PERCENT }
}
