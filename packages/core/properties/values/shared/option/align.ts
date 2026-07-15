import { ValueType } from "../../../constants"
import { Align } from "../../layout/align"

export interface AlignOptionValue {
  type: ValueType.OPTION
  value: Align
}
