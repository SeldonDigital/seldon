/** Discriminator for theme token entries (distinct from property `ValueType`). */

export enum TokenType {
  MODULATED = "modulated",
  /** px/rem length on scale slots (`size`, `margin`, …), or `Unit.NUMBER` for unitless numeric cells (`fontWeight`, `lineHeight`). */
  EXACT = "exact",
  SWATCH = "swatch",
  FONT_FAMILY = "font.family",
  OPTION = "option",
  LOOK = "look",
  DYNAMIC_SWATCH = "dynamic.swatch",
  /** Grouped configuration cell for the Computed section (modulation, color harmony, compute-function inputs). Not referenceable and not `customN`-extensible. */
  COMPUTED = "computed.group",
}
