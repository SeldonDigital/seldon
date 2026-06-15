/**
 * Branded `@namespace.slot` strings used in property theme references.
 */
import {
  ThemeBorderId,
  ThemeBorderWidthId,
  ThemeCornersId,
  ThemeDimensionId,
  ThemeFontFamilyId,
  ThemeFontId,
  ThemeFontSizeId,
  ThemeFontWeightId,
  ThemeGradientId,
  ThemeLineHeightId,
  ThemeScrollbarId,
  ThemeShadowId,
  ThemeSizeId,
  ThemeSpacingId,
  ThemeSwatchId,
} from "./theme-token-ids"

export type ThemeBlurKey = `@blur.${ThemeSizeId}`
export type ThemeBorderKey = `@border.${ThemeBorderId}`
export type ThemeBorderWidthKey = `@borderWidth.${ThemeBorderWidthId}`
export type ThemeCornersKey = `@corners.${ThemeCornersId}`
export type ThemeDimensionKey = `@dimension.${ThemeDimensionId}`
export type ThemeFontKey = `@font.${ThemeFontId}`
export type ThemeFontSizeKey = `@fontSize.${ThemeFontSizeId}`
export type ThemeFontWeightKey = `@fontWeight.${ThemeFontWeightId}`
export type ThemeFontFamilyKey = `@fontFamily.${ThemeFontFamilyId}`
export type ThemeGapKey = `@gap.${ThemeSpacingId}`
export type ThemeGradientKey = `@gradient.${ThemeGradientId}`
export type ThemeLineHeightKey = `@lineHeight.${ThemeLineHeightId}`
export type ThemeMarginKey = `@margin.${ThemeSpacingId}`
export type ThemePaddingKey = `@padding.${ThemeSpacingId}`
export type ThemeScrollbarKey = `@scrollbar.${ThemeScrollbarId}`
export type ThemeShadowKey = `@shadow.${ThemeShadowId}`
export type ThemeSizeKey = `@size.${ThemeSizeId}`
export type ThemeSpreadKey = `@spread.${ThemeSizeId}`
export type ThemeSwatchKey = `@swatch.${ThemeSwatchId}`

export type ThemeValueKey =
  | ThemeBlurKey
  | ThemeBorderKey
  | ThemeBorderWidthKey
  | ThemeCornersKey
  | ThemeDimensionKey
  | ThemeFontKey
  | ThemeFontSizeKey
  | ThemeFontWeightKey
  | ThemeGapKey
  | ThemeGradientKey
  | ThemeLineHeightKey
  | ThemeMarginKey
  | ThemePaddingKey
  | ThemeScrollbarKey
  | ThemeShadowKey
  | ThemeSizeKey
  | ThemeSpreadKey
  | ThemeSwatchKey
