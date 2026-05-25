import { ValueType } from "../../../constants"
import { Align } from "../../layout/align"

export interface AlignExactValue {
  type: ValueType.EXACT
  value: Align
}

export interface AlignOptionValue {
  type: ValueType.OPTION
  value: Align
}
