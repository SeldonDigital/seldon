import { TokenType } from "../../../constants/token-type"

/** Font stack entry on `StockTheme.fontFamily`. */
export interface ThemeFontFamilyToken {
  type: TokenType.FONT_FAMILY
  intent?: string
  parameters: string
}
