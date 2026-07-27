import type { ValueType } from "../../../constants"
import type { PercentageValue } from "../exact/percentage"
import type { PixelValue } from "../exact/pixel"
import type { RemValue } from "../exact/rem"

export type DoubleAxisValue = {
  type: ValueType.EXACT
  value: {
    x: PixelValue["value"] | RemValue["value"] | PercentageValue["value"]
    y: PixelValue["value"] | RemValue["value"] | PercentageValue["value"]
  }
}
