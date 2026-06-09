import {
  BackgroundValue,
  BorderValue,
  BorderWidthThemeValue,
  ButtonSizeThemeValue,
  ColorThemeValue,
  CornerThemeValue,
  DimensionThemeValue,
  FontFamilyThemeValue,
  FontSizeThemeValue,
  FontValue,
  FontWeightThemeValue,
  GapThemeValue,
  GradientValue,
  LineHeightThemeValue,
  MarginSideThemeValue,
  PaddingSideThemeValue,
  ShadowBlurThemeValue,
  ShadowSpreadThemeValue,
  ShadowValue,
  SizeThemeValue,
} from "../values"

/**
 * Every atomic payload that stores a theme token on `value` instead of a literal.
 * Pairs with `themes/types/theme-reference-keys.ts` (the `@namespace.slot` strings these values carry).
 */
export type ThemeValue =
  | DimensionThemeValue
  | GapThemeValue
  | MarginSideThemeValue
  | PaddingSideThemeValue
  | SizeThemeValue
  | ButtonSizeThemeValue
  | ColorThemeValue
  | BackgroundValue
  | BorderValue
  | BorderWidthThemeValue
  | CornerThemeValue
  | FontValue
  | FontFamilyThemeValue
  | FontSizeThemeValue
  | FontWeightThemeValue
  | LineHeightThemeValue
  | GradientValue
  | ShadowValue
  | ShadowBlurThemeValue
  | ShadowSpreadThemeValue
