import type { Unit } from "../../../../properties/constants/shared/units"
import { TokenType } from "../../../constants/token-type"

/**
 * Payload for a {@link TokenType.EXACT} cell. Holds a fixed length (`px` / `rem`),
 * a fixed unitless number (`number`), a fixed percentage (`%`), or a fixed angle (`deg`).
 *
 * Which subset is actually accepted depends on the section: per-section schemas validate
 * the unit against the section's allowed list. For example, length sections (`size`,
 * `dimension`, `margin`, `padding`, `gap`, `corners`, `fontSize`, `blur`, `spread`) accept
 * only `px` / `rem`; `fontWeight` / `lineHeight` accept only `number`.
 */
export interface ThemeExactDimension {
  unit: Unit.PX | Unit.REM | Unit.PERCENT | Unit.DEGREES | Unit.NUMBER
  value: number
}

/** Exact token: fixed length or fixed unitless number on ordinal tables. */
export interface ThemeExact {
  type: TokenType.EXACT
  name?: string
  intent?: string
  parameters: ThemeExactDimension
}
