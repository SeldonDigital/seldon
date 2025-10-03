import { BorderStyle, ValueType } from "../../../constants"

export interface BorderStylePresetValue {
  type: ValueType.PRESET
  value: BorderStyle
}

export type BorderStyleValue = BorderStylePresetValue
