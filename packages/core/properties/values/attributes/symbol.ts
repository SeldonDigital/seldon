import { IconId } from "../../../components/icons"
import { ValueType } from "../../constants"

export interface SymbolValue {
  type: ValueType.PRESET
  value: IconId | string
}
