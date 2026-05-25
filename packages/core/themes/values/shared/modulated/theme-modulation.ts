import { TokenType } from "../../../constants/token-type"

export interface ModulationParameters {
  step: number
}

/** Ordinal step token (`@size.*`, `@margin.*`, …). */
export interface ThemeModulation {
  type: TokenType.MODULATED
  name?: string
  intent?: string
  parameters: ModulationParameters
  /** Resolved length cached after `computeTheme`. Not authoring input. */
  value?: number
}
