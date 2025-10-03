import { ThemeSizeKey } from "../../../themes/types"
import { ValueType } from "../../constants"
import { ComputedAutoFitValue } from "../computed/auto-fit"
import { ComputedMatchValue } from "../computed/match"
import { PixelValue } from "../shared/pixel"
import { RemValue } from "../shared/rem"

export type SizeValue =
  | PixelValue
  | RemValue
  | ComputedAutoFitValue
  | ComputedMatchValue
  | SizeThemeValue

export type SizeThemeValue = {
  type: ValueType.THEME_ORDINAL
  value: ThemeSizeKey
}
