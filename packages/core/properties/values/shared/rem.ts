import { Unit, ValueType } from "../../constants"

export type RemValue = {
  type: ValueType.EXACT
  value: { value: number; unit: Unit.REM }
}
