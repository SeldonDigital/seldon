import type { BorderCompound } from "../../../properties/values/appearance/border"
import { TokenType } from "../../constants/token-type"

export type BorderParameters = Pick<
  BorderCompound,
  "style" | "color" | "width" | "opacity" | "brightness"
>

export interface ThemeBorder {
  type: TokenType.LOOK
  name?: string
  intent?: string
  parameters: BorderParameters
}
