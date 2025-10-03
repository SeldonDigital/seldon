import { ThemeBlurKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PixelValue } from "../../shared/pixel"
import { RemValue } from "../../shared/rem"

export interface ShadowBlurThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeBlurKey
}

export type ShadowBlurValue = PixelValue | RemValue | ShadowBlurThemeValue
