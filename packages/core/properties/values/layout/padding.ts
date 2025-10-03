import { ThemePaddingKey } from "../../../themes/types"
import { ValueType } from "../../constants/value-types"
import { ComputedOpticalPaddingValue } from "../computed/optical-padding"
import { EmptyValue } from "../shared/empty"
import { PixelValue } from "../shared/pixel"
import { RemValue } from "../shared/rem"

export interface PaddingValue {
  top?: PaddingSideValue
  right?: PaddingSideValue
  bottom?: PaddingSideValue
  left?: PaddingSideValue
}

export interface PaddingSideThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemePaddingKey
}

export type PaddingSideValue = (
  | PaddingSideThemeValue
  | PixelValue
  | RemValue
  | ComputedOpticalPaddingValue
  | EmptyValue
) & {
  restrictions?: {
    allowedValues?: ThemePaddingKey[]
  }
}
