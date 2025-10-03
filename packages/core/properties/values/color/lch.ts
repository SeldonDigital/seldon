import { ValueType } from "../../constants"

export interface LCH {
  lightness: number
  chroma: number
  hue: number
}

export interface LCHValue {
  type: ValueType.EXACT
  value: LCH
}
