import { Unit } from "../../../constants"
import { ValueType } from "../../../constants"

export type DegreesValue = {
  type: ValueType.EXACT
  value: { value: number; unit: Unit.DEGREES }
}
