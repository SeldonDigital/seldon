import type { TokenType } from "../../../constants/token-type"

export interface ModulationParameters {
  step: number
}

/**
 * Ordinal step token (`@size.*`, `@margin.*`, …). `value` is the resolved length cached after
 * `computeTheme` and is not authoring input.
 */
export interface ThemeModulation {
  type: TokenType.MODULATED
  parameters: ModulationParameters
  name?: string
  intent?: string
  value?: number
}
