import { BackgroundPosition, ValueType } from "../../../constants"
import { DoubleAxisValue } from "../../shared/double-axis"
import { PercentageValue } from "../../shared/percentage"
import { PixelValue } from "../../shared/pixel"
import { RemValue } from "../../shared/rem"

export interface BackgroundPositionPresetValue {
  type: ValueType.PRESET
  value: BackgroundPosition
}

export type SingleBackgroundPositionValue =
  | PixelValue
  | RemValue
  | PercentageValue
  | BackgroundPositionPresetValue

export type BackgroundPositionValue =
  | SingleBackgroundPositionValue
  | DoubleAxisValue
