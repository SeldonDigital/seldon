import { ThemeDimensionKey } from "../../../themes/types"
import { Resize, ValueType } from "../../constants"
import { PercentageValue } from "../shared/percentage"
import { PixelValue } from "../shared/pixel"
import { RemValue } from "../shared/rem"

export interface DimensionThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeDimensionKey
}

export interface DimensionResizeValue {
  type: ValueType.PRESET
  value: Resize
}

export type DimensionValue =
  | DimensionThemeValue
  | DimensionResizeValue
  | PixelValue
  | RemValue
  | PercentageValue
