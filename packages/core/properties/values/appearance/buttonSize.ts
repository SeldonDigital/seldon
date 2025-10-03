import { ThemeFontSizeKey } from "../../../themes/types"
import { ValueType } from "../../constants"
import { PixelValue } from "../shared/pixel"
import { RemValue } from "../shared/rem"

// ButtonSize uses the font sizes from the theme in order to base size of the icon on the label
export type ButtonSizeValue = PixelValue | RemValue | ButtonSizeThemeValue

export interface ButtonSizeThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeFontSizeKey
}
