import type { BackgroundLayer } from "../../../properties/values/appearance/background"
import { TokenType } from "../../constants/token-type"

export type BackgroundParameters = Omit<BackgroundLayer, "preset">

export interface ThemeBackground {
  type: TokenType.LOOK
  name?: string
  intent?: string
  parameters: BackgroundParameters
}
