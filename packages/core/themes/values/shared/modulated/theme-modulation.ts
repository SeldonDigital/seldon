import type { TokenType } from "../../../constants/token-type"

export interface ModulationParameters {
  step: number
}

/** Ordinal step token (`@size.*`, `@margin.*`, …). */
export interface ThemeModulation {
  type: TokenType.MODULATED
  parameters: ModulationParameters
  name?: string
  intent?: string
  /** Resolved length cached after `computeTheme`. Not authoring input. */
  value?: number
}
