import { ValueType } from "../../../constants"
import { PercentageValue } from "../exact/percentage"
import { PixelValue } from "../exact/pixel"
import { RemValue } from "../exact/rem"

export type DoubleAxisValue = {
  type: ValueType.EXACT
  value: {
    x: PixelValue["value"] | RemValue["value"] | PercentageValue["value"]
    y: PixelValue["value"] | RemValue["value"] | PercentageValue["value"]
  }
}
