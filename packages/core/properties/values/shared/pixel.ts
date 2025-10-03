import { Unit, ValueType } from "../../constants"

export type PixelValue = {
  type: ValueType.EXACT
  value: { value: number; unit: Unit.PX }
}
