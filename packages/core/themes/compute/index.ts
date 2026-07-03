/**
 * Theme completion and normalization (not `properties/compute`). Prefer `computeTheme` from
 * `@seldon/core/themes/helpers` or this entry to avoid import cycles with `themes/catalog`.
 */
export { computeTheme } from "../helpers/compute-theme"
export { getDynamicSwatchColors, getPalette } from "./get-dynamic-swatch-color"
export {
  MODE_NEUTRAL_SWATCH_IDS,
  MODE_SWAPPED_SWATCH_PAIRS,
  getOppositeModeSwatchColor,
  getOppositeModeSwatches,
} from "./get-mode-swatches"
export { colorspaceLiteralToHsl, parseColorspaceLiteral } from "./colorspaces"
export { getDynamicSwatchName } from "./get-dynamic-swatch-names"
export { instantiateTheme, type PresetThemesById } from "./instantiate-theme"
export { normalizeThemeInput } from "./normalize-theme"
export {
  normalizeThemeExactValue,
  normalizeThemeNumber,
} from "./normalize-theme-value"
export { normalizeThemeSwatchParameters } from "./normalize-theme-swatch-parameters"
