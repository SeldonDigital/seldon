import { Unit } from "../../../constants"
import { ValueType } from "../../../constants"

export type RemValue = {
  type: ValueType.EXACT
  value: { value: number; unit: Unit.REM }
}
