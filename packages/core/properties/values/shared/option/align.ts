import type { ValueType } from "../../../constants"
import type { Align } from "../../layout/align"

export interface AlignOptionValue {
  type: ValueType.OPTION
  value: Align
}
