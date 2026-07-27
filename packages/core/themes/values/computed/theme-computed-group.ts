/**
 * Base shape for grouped configuration cells in the theme "Computed" section.
 *
 * Each group is a `TokenType.COMPUTED` cell shaped like a look cell
 * (`{ type, name?, intent?, parameters }`) but it is not referenceable through
 * an `@` path and not `customN`-extensible. The compute engines and the
 * color-harmony generator read their inputs from these groups instead of from
 * hardcoded constants.
 */
import type { TokenType } from "../../constants/token-type"

/** Base shape for every grouped configuration cell in the Computed section. */
export interface ThemeComputedGroup<TParameters> {
  type: TokenType.COMPUTED
  parameters: TParameters
  name?: string
  intent?: string
}
