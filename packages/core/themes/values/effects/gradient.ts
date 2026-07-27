import type { GradientCompound } from "../../../properties/values/effects/gradients"
import type { TokenType } from "../../constants/token-type"

export type GradientParameters = Omit<GradientCompound, "preset">

export interface ThemeGradient {
  type: TokenType.LOOK
  name?: string
  intent?: string
  parameters: GradientParameters
}
