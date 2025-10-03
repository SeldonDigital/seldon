import { ValueType } from "../../constants"
import { ScrollbarStyle } from "../../constants/scrollbar-styles"

export interface ScrollbarStyleValue {
  type: ValueType.PRESET
  value: ScrollbarStyle
}
