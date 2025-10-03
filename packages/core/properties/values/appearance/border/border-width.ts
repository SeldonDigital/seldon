import { ThemeBorderWidthKey } from "../../../../themes/types"
import { BorderWidth, ValueType } from "../../../constants"
import { EmptyValue } from "../../shared/empty"
import { PixelValue } from "../../shared/pixel"
import { RemValue } from "../../shared/rem"

export type BorderWidthValue =
  | BorderWidthThemeValue
  | BorderWidthHairlineValue
  | PixelValue
  | RemValue
  | EmptyValue

export interface BorderWidthThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeBorderWidthKey
}

export interface BorderWidthHairlineValue {
  type: ValueType.PRESET
  value: BorderWidth.HAIRLINE
}
