import { Direction, ValueType } from "../../constants"

export interface DirectionPresetValue {
  type: ValueType.PRESET
  value: Direction
}

export type DirectionValue = DirectionPresetValue
