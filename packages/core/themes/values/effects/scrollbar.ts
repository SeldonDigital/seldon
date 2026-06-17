import type { ColorValue } from "../../../properties/values/appearance/color"
import { PixelValue } from "../../../properties/values/shared/exact/pixel"
import { RemValue } from "../../../properties/values/shared/exact/rem"
import { BooleanValue } from "../../../properties/values/shared/option/boolean"
import { TokenType } from "../../constants/token-type"

export interface ScrollbarParameters {
  trackColor: ColorValue
  thumbColor: ColorValue
  thumbHoverColor: ColorValue
  trackSize: RemValue | PixelValue
  rounded: BooleanValue
}

export interface ThemeScrollbar {
  type: TokenType.LOOK
  name?: string
  intent?: string
  parameters: ScrollbarParameters
}
