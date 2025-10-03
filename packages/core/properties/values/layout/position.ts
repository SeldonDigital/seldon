import { EmptyValue } from "../shared/empty"
import { PixelValue } from "../shared/pixel"
import { RemValue } from "../shared/rem"

export interface PositionValue {
  top?: PositionSideValue
  right?: PositionSideValue
  bottom?: PositionSideValue
  left?: PositionSideValue
}

export type PositionSideValue = PixelValue | RemValue | EmptyValue
