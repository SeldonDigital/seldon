import { Unit, ValueType } from "../../constants"

export type NumberValue = {
  type: ValueType.EXACT
  value: { value: number; unit: Unit.NUMBER }
}
