import { ValueType } from "../../../constants"
import { Color } from "../../appearance/color"

/** Stores the `transparent` color keyword as an option pick. */
export interface TransparentValue {
  type: ValueType.OPTION
  value: Color.TRANSPARENT
}
