import type { ShadowCompound } from "../../../properties/values/effects/shadow"
import { TokenType } from "../../constants/token-type"

export type ShadowParameters = Omit<ShadowCompound, "preset" | "style">

export interface ThemeShadow {
  type: TokenType.LOOK
  name?: string
  intent?: string
  parameters: ShadowParameters
}
