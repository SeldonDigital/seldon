import type { FontCompound } from "../../../properties/values/typography/font"
import type { TokenType } from "../../constants/token-type"

export type FontParameters = Pick<
  FontCompound,
  "family" | "style" | "weight" | "size" | "lineHeight" | "textCase" | "letterSpacing"
>

export interface ThemeFont {
  type: TokenType.LOOK
  parameters: FontParameters
  name?: string
  intent?: string
}
