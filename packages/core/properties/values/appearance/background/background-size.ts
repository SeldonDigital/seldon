import { BackgroundPosition, ValueType } from "../../../constants"
import { DoubleAxisValue } from "../../shared/double-axis"
import { PercentageValue } from "../../shared/percentage"
import { PixelValue } from "../../shared/pixel"
import { RemValue } from "../../shared/rem"
import { ImageFitValue } from "../image-fit"

export type SingleBackgroundSizeValue =
  | PixelValue
  | RemValue
  | PercentageValue
  | ImageFitValue

export type BackgroundSizeValue = SingleBackgroundSizeValue | DoubleAxisValue
