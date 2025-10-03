import { ThemeFontSizeKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { ComputedAutoFitValue } from "../../computed/auto-fit"
import { ComputedMatchValue } from "../../computed/match"
import { PixelValue } from "../../shared/pixel"
import { RemValue } from "../../shared/rem"

export type FontSizeValue =
  | PixelValue
  | RemValue
  | ComputedAutoFitValue
  | ComputedMatchValue
  | FontSizeThemeValue

export interface FontSizeThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeFontSizeKey
}
