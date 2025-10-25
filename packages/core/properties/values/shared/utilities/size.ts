import { ThemeSizeKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { ComputedAutoFitValue } from "../computed/auto-fit"
import { ComputedMatchValue } from "../computed/match"
import { EmptyValue } from "../empty/empty"
import { PixelValue } from "../exact/pixel"
import { RemValue } from "../exact/rem"

export type SizeValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | ComputedAutoFitValue
  | ComputedMatchValue
  | SizeThemeValue

export type SizeThemeValue = {
  type: ValueType.THEME_ORDINAL
  value: ThemeSizeKey
}
