import { ThemeMarginKey } from "../../../themes/types"
import { ValueType } from "../../constants"
import { EmptyValue } from "../shared/empty"
import { PixelValue } from "../shared/pixel"
import { RemValue } from "../shared/rem"

export interface MarginValue {
  top?: MarginSideValue
  right?: MarginSideValue
  bottom?: MarginSideValue
  left?: MarginSideValue
}

export interface MarginSideThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeMarginKey
}

export type MarginSideValue = (
  | MarginSideThemeValue
  | PixelValue
  | RemValue
  | EmptyValue
) & {
  restrictions?: {
    allowedValues?: ThemeMarginKey[]
  }
}
