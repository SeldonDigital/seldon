import { ValueType } from "../../../constants"

export interface RGB {
  red: number
  green: number
  blue: number
}

export interface RGBValue {
  type: ValueType.EXACT
  value: RGB
}
