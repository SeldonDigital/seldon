import type { TokenType } from "../../../constants/token-type"

/** Font stack entry on `StockTheme.fontFamily`. */
export interface ThemeFontFamilyToken {
  type: TokenType.FONT_FAMILY
  parameters: string
  intent?: string
}
