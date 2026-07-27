import type { Unit, ValueType } from "../../../constants"

export type NumberValue = {
  type: ValueType.EXACT
  value: number | { value: number; unit: Unit.NUMBER }
}
