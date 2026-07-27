import type { ValueType } from "../../../constants"
import type { Color } from "../../appearance/color"

/** Stores the `transparent` color keyword as an option pick. */
export interface TransparentValue {
  type: ValueType.OPTION
  value: Color.TRANSPARENT
}
