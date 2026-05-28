/**
 * Theme token value shapes and runtime guards.
 *
 * Shared layout under `shared/` (browse the tree for the model):
 * - `shared/exact/` — literal payloads (`ThemeExact`, color-space literals)
 * - `shared/modulated/` — `TokenType.MODULATED` ordinal steps
 * - `shared/option/` — `TokenType.OPTION` cells (e.g. border hairline)
 * - `shared/ordinal/` — composed table cells (`ThemeScaleToken`, `ThemeBorderWidth`)
 * - `shared/palette/` — swatch / dynamic palette slot types
 * - `shared/font-stack/` — font family stack tokens
 * - `shared/type-guards/` — runtime type predicates for token cells + LOOK rows
 * - `appearance/`, `effects/`, `typography/` — compound LOOK-shaped entries
 *
 * `TokenType` lives in `themes/constants`.
 */

export { TokenType } from "../constants"

export type { ColorSpaceLiteral } from "./shared/exact/color-spaces"
export type { ThemeExact, ThemeExactDimension } from "./shared/exact/theme-exact"

export type {
  ModulationParameters,
  ThemeModulation,
} from "./shared/modulated/theme-modulation"
export type {
  BorderWidthOption,
  ThemeBorderWidthOption,
} from "./shared/option/theme-border-width-option"
export { BORDER_WIDTH_OPTIONS } from "./shared/option/theme-border-width-option"
export type { ThemeBorderWidth } from "./shared/ordinal/theme-border-width"
export type { ThemeScaleToken } from "./shared/ordinal/theme-scale"
export type {
  StockSwatchDynamic,
  StockThemeSwatch,
  ThemePaletteSlot,
  ThemeSwatch,
} from "./shared/palette/theme-swatch"
export { THEME_PALETTE_SLOTS } from "./shared/palette/theme-swatch"
export type { ThemeSwatchParameters } from "./shared/palette/theme-swatch-parameters"
export type { ThemeFontFamilyToken } from "./shared/font-stack/theme-font-family-token"

export {
  isDynamicSwatchToken,
  isFontFamilyToken,
  isLookToken,
  isModulatedToken,
  isOptionToken,
  isSwatchToken,
  isThemeExactNumberToken,
  isThemeExactToken,
} from "./shared/type-guards/theme-token-type-guards"

export type {
  BackgroundParameters,
  ThemeBackground,
} from "./appearance/background"
export type { BorderParameters, ThemeBorder } from "./appearance/border"

export type { GradientParameters, ThemeGradient } from "./effects/gradient"
export type { ScrollbarParameters, ThemeScrollbar } from "./effects/scrollbar"
export type { ShadowParameters, ThemeShadow } from "./effects/shadow"

export type { FontParameters, ThemeFont } from "./typography/font"
