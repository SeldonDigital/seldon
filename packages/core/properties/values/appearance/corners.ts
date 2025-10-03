import { ThemeCornersKey } from "../../../themes/types"
import { Corner, ValueType } from "../../constants"
import { EmptyValue } from "../shared/empty"
import { PixelValue } from "../shared/pixel"
import { RemValue } from "../shared/rem"

export interface CornersValue {
  topLeft?: CornerValue
  topRight?: CornerValue
  bottomLeft?: CornerValue
  bottomRight?: CornerValue
}

export type CornerValue = (
  | CornerThemeValue
  | CornerRoundedValue
  | CornerSquaredValue
  | PixelValue
  | RemValue
  | EmptyValue
) & {
  restrictions?: {
    allowedValues?: ThemeCornersKey[]
  }
}

export interface CornerThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeCornersKey
}

export interface CornerRoundedValue {
  type: ValueType.PRESET
  value: Corner.ROUNDED
}

export interface CornerSquaredValue {
  type: ValueType.PRESET
  value: Corner.SQUARED
}
