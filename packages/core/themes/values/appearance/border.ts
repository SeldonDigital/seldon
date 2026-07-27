import type { BorderCompound } from "../../../properties/values/appearance/border"
import type { TokenType } from "../../constants/token-type"

export type BorderParameters = Pick<
  BorderCompound,
  "style" | "color" | "width" | "opacity" | "brightness"
>

export interface ThemeBorder {
  type: TokenType.LOOK
  parameters: BorderParameters
  name?: string
  intent?: string
}
