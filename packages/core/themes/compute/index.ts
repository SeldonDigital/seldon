/**
 * Theme completion and normalization (not `properties/compute`). Prefer `computeTheme` from
 * `@seldon/core/themes/helpers` or this entry to avoid import cycles with `themes/stock`.
 */
export { computeTheme } from "../helpers/compute-theme"
export { getDynamicSwatchColors, getPalette } from "./get-dynamic-swatch-color"
export {
  colorspaceLiteralToHsl,
  parseColorspaceLiteral,
} from "./colorspaces"
export { getDynamicSwatchName } from "./get-dynamic-swatch-names"
export { instantiateTheme, type PresetThemesById } from "./instantiate-theme"
export { normalizeThemeInput } from "./normalize-theme"
export {
  normalizeThemeExactValue,
  normalizeThemeNumber,
} from "./normalize-theme-value"
export { normalizeThemeSwatchParameters } from "./normalize-theme-swatch-parameters"
