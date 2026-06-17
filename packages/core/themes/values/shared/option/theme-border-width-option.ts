import { TokenType } from "../../../constants/token-type"

/** Allowed option keys for `borderWidth` cells. Extend this list to add future options. */
export const BORDER_WIDTH_OPTIONS = ["hairline"] as const

export type BorderWidthOption = (typeof BORDER_WIDTH_OPTIONS)[number]

/**
 * Option-typed cell on `borderWidth` (e.g. `hairline`).
 * Distinct from component property `ValueType.OPTION` values.
 */
export interface ThemeBorderWidthOption {
  type: TokenType.OPTION
  name?: string
  intent?: string
  parameters: BorderWidthOption
}
