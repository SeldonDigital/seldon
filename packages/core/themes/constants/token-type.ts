/**
 * Discriminator for theme token entries, distinct from property `ValueType`. `EXACT` is a px/rem
 * length on scale slots (`size`, `margin`, …), or `Unit.NUMBER` for unitless numeric cells
 * (`fontWeight`, `lineHeight`). `COMPUTED` is a grouped configuration cell for the Computed section
 * (modulation, color harmony, compute-function inputs), which is not referenceable and not
 * `customN`-extensible.
 */
export enum TokenType {
  MODULATED = "modulated",
  EXACT = "exact",
  SWATCH = "swatch",
  FONT_FAMILY = "font.family",
  OPTION = "option",
  LOOK = "look",
  DYNAMIC_SWATCH = "dynamic.swatch",
  COMPUTED = "computed.group",
}
