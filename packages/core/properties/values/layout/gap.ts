import { ThemeGapKey } from "../../../themes/types"
import { ValueType } from "../../constants"
import { Gap } from "../../constants/gap"
import { ComputedOpticalPaddingValue } from "../computed/optical-padding"
import { PixelValue } from "../shared/pixel"
import { RemValue } from "../shared/rem"

export interface GapThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeGapKey
}

export interface GapEvenlySpacedValue {
  type: ValueType.PRESET
  value: Gap.EVENLY_SPACED
}

export type GapValue =
  | GapThemeValue
  | GapEvenlySpacedValue
  | PixelValue
  | RemValue
  | ComputedOpticalPaddingValue // TODO: FIX THIS
