import { ValueType } from "../../constants"
import { PercentageValue } from "./percentage"
import { PixelValue } from "./pixel"
import { RemValue } from "./rem"

export type DoubleAxisValue = {
  type: ValueType.EXACT
  value: {
    x: PixelValue["value"] | RemValue["value"] | PercentageValue["value"]
    y: PixelValue["value"] | RemValue["value"] | PercentageValue["value"]
  }
}
