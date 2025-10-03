import {
  Theme,
  ThemeBackground,
  ThemeBackgroundId,
  ThemeBackgroundKey,
  ThemeBlurKey,
  ThemeBorder,
  ThemeBorderId,
  ThemeBorderKey,
  ThemeBorderWidth,
  ThemeBorderWidthId,
  ThemeBorderWidthKey,
  ThemeCornersId,
  ThemeCornersKey,
  ThemeDimensionId,
  ThemeDimensionKey,
  ThemeFont,
  ThemeFontFamilyId,
  ThemeFontFamilyKey,
  ThemeFontId,
  ThemeFontKey,
  ThemeFontSizeId,
  ThemeFontSizeKey,
  ThemeFontWeightId,
  ThemeFontWeightKey,
  ThemeGapKey,
  ThemeGradient,
  ThemeGradientId,
  ThemeGradientKey,
  ThemeLineHeightId,
  ThemeLineHeightKey,
  ThemeMarginKey,
  ThemeModulation,
  ThemeNumber,
  ThemeOption,
  ThemePaddingKey,
  ThemeScrollbar,
  ThemeScrollbarId,
  ThemeScrollbarKey,
  ThemeSection,
  ThemeShadow,
  ThemeShadowId,
  ThemeShadowKey,
  ThemeSizeId,
  ThemeSizeKey,
  ThemeSpacingId,
  ThemeSpreadKey,
  ThemeSwatch,
  ThemeSwatchId,
  ThemeSwatchKey,
} from "../../themes/types"
import { isThemeValueKey } from "../validation/theme"

/**
 * Retrieves a theme option value from a theme object using a theme value key
 *
 * @param key - The theme value key (e.g., "@fontSize.medium", "@swatch.primary")
 * @param theme - The theme object to retrieve the value from
 * @returns The theme option value with appropriate type
 * @throws Error if the key is invalid or the value is not found
 */
export function getThemeOption(key: ThemeFontKey, theme: Theme): ThemeFont
export function getThemeOption(key: ThemeFontFamilyKey, theme: Theme): string
export function getThemeOption(
  key: ThemeFontSizeKey,
  theme: Theme,
): ThemeModulation
export function getThemeOption(
  key: ThemeFontWeightKey,
  theme: Theme,
): ThemeNumber
export function getThemeOption(
  key: ThemeLineHeightKey,
  theme: Theme,
): ThemeNumber
export function getThemeOption(
  key: ThemeMarginKey,
  theme: Theme,
): ThemeModulation
export function getThemeOption(
  key: ThemePaddingKey,
  theme: Theme,
): ThemeModulation
export function getThemeOption(key: ThemeGapKey, theme: Theme): ThemeModulation
export function getThemeOption(key: ThemeSizeKey, theme: Theme): ThemeModulation
export function getThemeOption(
  key: ThemeDimensionKey,
  theme: Theme,
): ThemeModulation
export function getThemeOption(key: ThemeSwatchKey, theme: Theme): ThemeSwatch
export function getThemeOption(
  key: ThemeBorderWidthKey,
  theme: Theme,
): ThemeBorderWidth
export function getThemeOption(
  key: ThemeCornersKey,
  theme: Theme,
): ThemeModulation
export function getThemeOption(key: ThemeShadowKey, theme: Theme): ThemeShadow
export function getThemeOption(
  key: ThemeScrollbarKey,
  theme: Theme,
): ThemeScrollbar
export function getThemeOption(
  key: ThemeGradientKey,
  theme: Theme,
): ThemeGradient
export function getThemeOption(
  key: ThemeBackgroundKey,
  theme: Theme,
): ThemeBackground
export function getThemeOption(key: ThemeBlurKey, theme: Theme): ThemeModulation
export function getThemeOption(
  key: ThemeSpreadKey,
  theme: Theme,
): ThemeModulation
export function getThemeOption(key: ThemeBorderKey, theme: Theme): ThemeBorder
export function getThemeOption(key: string, theme: Theme): ThemeOption

export function getThemeOption(key: string, theme: Theme): ThemeOption {
  if (!isThemeValueKey(key)) {
    throw new Error(`${key} is not a valid theme value`)
  }

  const [section, optionId] = key.split(".")

  let result: ThemeOption

  switch (section as `@${ThemeSection}`) {
    case "@fontFamily":
      result = theme.fontFamily[optionId as ThemeFontFamilyId]
      break
    case "@font":
      result = theme.font[optionId as ThemeFontId]
      break
    case "@fontSize":
      result = theme.fontSize[optionId as ThemeFontSizeId]
      break
    case "@fontWeight":
      result = theme.fontWeight[optionId as ThemeFontWeightId]
      break
    case "@lineHeight":
      result = theme.lineHeight[optionId as ThemeLineHeightId]
      break
    case "@margin":
      result = theme.margin[optionId as ThemeSpacingId]
      break
    case "@padding":
      result = theme.padding[optionId as ThemeSpacingId]
      break
    case "@gap":
      result = theme.gap[optionId as ThemeSpacingId]
      break
    case "@size":
      result = theme.size[optionId as ThemeSizeId]
      break
    case "@dimension":
      result = theme.dimension[optionId as ThemeDimensionId]
      break
    case "@swatch":
      result = theme.swatch[optionId as ThemeSwatchId]
      break
    case "@borderWidth":
      result = theme.borderWidth[optionId as ThemeBorderWidthId]
      break
    case "@corners":
      result = theme.corners[optionId as ThemeCornersId]
      break
    case "@shadow":
      result = theme.shadow[optionId as ThemeShadowId]
      break
    case "@scrollbar":
      result = theme.scrollbar[optionId as ThemeScrollbarId]
      break
    case "@gradient":
      result = theme.gradient[optionId as ThemeGradientId]
      break
    case "@background":
      result = theme.background[optionId as ThemeBackgroundId]
      break
    case "@blur":
      result = theme.blur[optionId as ThemeSizeId]
      break
    case "@spread":
      result = theme.spread[optionId as ThemeSizeId]
      break
    case "@border":
      result = theme.border[optionId as ThemeBorderId]
      break
    default:
      throw new Error(`Theme value ${key} not found`)
  }

  if (result === undefined) {
    throw new Error(`Theme value ${key} not found`)
  }

  return result
}
