import { Cursor, ValueType } from "../../constants"

export type CursorValue = CursorPresetValue

export interface CursorPresetValue {
  type: ValueType.PRESET
  value: Cursor
}
