import { ThemeSpreadKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PixelValue } from "../../shared/pixel"
import { RemValue } from "../../shared/rem"

export interface ShadowSpreadThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeSpreadKey
}

export type ShadowSpreadValue = PixelValue | RemValue | ShadowSpreadThemeValue
