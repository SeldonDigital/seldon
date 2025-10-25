import { Unit } from "../../../constants"
import { ValueType } from "../../../constants"

export type PixelValue = {
  type: ValueType.EXACT
  value: { value: number; unit: Unit.PX }
}
