import { ValueType } from "../../../constants"

export interface HSL {
  hue: number
  saturation: number
  lightness: number
}

export interface HSLValue {
  type: ValueType.EXACT
  value: HSL
}
