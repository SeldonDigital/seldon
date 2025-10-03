import { IconSetId } from "../components/icons"
import { BackgroundValue } from "../properties/values/appearance/background"
import { BorderBrightnessValue } from "../properties/values/appearance/border/border-brightness"
import { BorderColorValue } from "../properties/values/appearance/border/border-color"
import { BorderOpacityValue } from "../properties/values/appearance/border/border-opacity"
import { BorderStyleValue } from "../properties/values/appearance/border/border-style"
import { BorderWidthValue } from "../properties/values/appearance/border/border-width"
import { GradientValue } from "../properties/values/appearance/gradient"
import { SizeValue } from "../properties/values/appearance/size"
import { ColorValue } from "../properties/values/color/color"
import { HSL } from "../properties/values/color/hsl"
import { ShadowValue } from "../properties/values/effects/shadow"
import { EmptyValue } from "../properties/values/shared/empty"
import { PixelValue } from "../properties/values/shared/pixel"
import { RemValue } from "../properties/values/shared/rem"
import { TextCaseValue } from "../properties/values/typography/case"
import {
  FontFamilyThemeValue,
  FontFamilyValue,
} from "../properties/values/typography/font/font-family"
import { FontSizeValue } from "../properties/values/typography/font/font-size"
import { FontStyleValue } from "../properties/values/typography/font/font-style"
import { FontWeightValue } from "../properties/values/typography/font/font-weight"
import { LineHeightValue } from "../properties/values/typography/font/line-height"
import { LetterSpacingValue } from "../properties/values/typography/letter-spacing"

export enum Ratio {
  "15:16" = 1.067,
  MinorSecond = 1.067,
  "8:9" = 1.125,
  MajorSecond = 1.125,
  "5:6" = 1.2,
  MinorThird = 1.2,
  "4:5" = 1.25,
  MajorThird = 1.25,
  "3:4" = 1.333,
  PerfectFourth = 1.333,
  "1:√2" = 1.414,
  AugmentedFourth = 1.414,
  "2:3" = 1.5,
  PerfectFifth = 1.5,
  "5:8" = 1.6,
  MinorSixth = 1.6,
  "1:1.618" = 1.618,
  GoldenRatio = 1.618,
  "3:5" = 1.667,
  MajorSixth = 1.667,
  "9:16" = 1.778,
  MinorSeventh = 1.778,
  "8:15" = 1.875,
  MajorSeventh = 1.875,
  "1:2" = 2,
  Octave = 2,
  "2:5" = 2.5,
  MajorTenth = 2.5,
  "3:8" = 2.667,
  MajorEleventh = 2.667,
  "1:3" = 3,
  MajorTwelfth = 3,
  "1:4" = 4,
  DoubleOctave = 4,
}

export enum Harmony {
  Complementary,
  SplitComplementary,
  Triadic,
  Analogous,
  Square,
  Monochromatic,
}

export interface ModulationParameters {
  step: number
}

export interface ThemeModulation {
  name: string
  parameters: ModulationParameters
  value?: number
}

interface ThemeHairlineBorderWidth {
  name: string
  value: "hairline"
}

export type ThemeBorderWidth = ThemeModulation | ThemeHairlineBorderWidth

export interface ThemeNumber {
  name: string
  value: number
}

export interface ThemeSwatch {
  name: string
  intent: string
  type: "hsl"
  value: HSL
}

export type ThemeFontFamily = string

export interface FontParameters {
  family: FontFamilyValue | FontFamilyThemeValue
  style?: FontStyleValue
  weight: FontWeightValue
  size: FontSizeValue
  lineHeight?: LineHeightValue | EmptyValue
  textCase?: TextCaseValue | EmptyValue
  letterSpacing?: LetterSpacingValue | EmptyValue
}

export interface ThemeFont {
  name: string
  intent: string
  value: FontParameters
}

export type ShadowParameters = Omit<ShadowValue, "preset">

export interface ThemeShadow {
  name: string
  parameters: ShadowParameters
  value?: number
}

export interface BorderParameters {
  style?: BorderStyleValue | EmptyValue
  color?: BorderColorValue | EmptyValue
  width?: BorderWidthValue | EmptyValue
  opacity?: BorderOpacityValue | EmptyValue
  brightness?: BorderBrightnessValue | EmptyValue
}

export interface ThemeBorder {
  name: string
  parameters: BorderParameters
  value?: number
}

export type GradientParameters = Omit<GradientValue, "preset">

export interface ThemeGradient {
  name: string
  parameters: GradientParameters
  value?: number
}

export type BackgroundParameters = Omit<BackgroundValue, "preset">

export interface ThemeBackground {
  name: string
  parameters: BackgroundParameters
}

export interface ScrollbarParameters {
  trackColor: ColorValue
  thumbColor: ColorValue
  thumbHoverColor: ColorValue
  trackSize: RemValue | PixelValue
  rounded: boolean
}

export interface ThemeScrollbar {
  name: string
  parameters: ScrollbarParameters
}

export type ThemeOption =
  | ThemeBorderWidth
  | ThemeModulation
  | ThemeFont
  | ThemeNumber
  | ThemeShadow
  | ThemeBorder
  | ThemeGradient
  | ThemeBackground
  | ThemeScrollbar
  | ThemeSwatch
  | ThemeFontFamily

export type StaticTheme = {
  id: ThemeId
  name: string
  description: string
  intent: string
  core: {
    ratio: Ratio
    fontSize: number
    size: number
  }
  fontFamily: {
    primary: string
    secondary: string
  }
  color: {
    baseColor: HSL
    harmony: Harmony
    angle: number
    step: number
    whitePoint: number
    grayPoint: number
    blackPoint: number
    bleed: number
    contrastRatio: number
  }
  icon: {
    intent: string
    set: IconSetId
    defaultColor: ColorValue
    defaultSize: SizeValue
  }
  borderWidth: Record<ThemeBorderWidthId, ThemeBorderWidth>
  corners: Record<ThemeCornersId, ThemeModulation>
  font: Record<ThemeFontId, ThemeFont>
  fontSize: Record<ThemeFontSizeId, ThemeModulation>
  fontWeight: Record<ThemeFontWeightId, ThemeNumber>

  // Size
  size: Record<ThemeSizeId, ThemeModulation>
  dimension: Record<ThemeDimensionId, ThemeModulation>

  // Spacing
  margin: Record<ThemeSpacingId, ThemeModulation>
  padding: Record<ThemeSpacingId, ThemeModulation>
  gap: Record<ThemeSpacingId, ThemeModulation>

  lineHeight: Record<ThemeLineHeightId, ThemeNumber>
  swatch: Record<ThemeStaticSwatchId, ThemeSwatch>
  shadow: Record<ThemeShadowId, ThemeShadow>
  border: Record<ThemeBorderId, ThemeBorder>
  blur: Record<ThemeSizeId, ThemeModulation>
  spread: Record<ThemeSizeId, ThemeModulation>
  gradient: Record<ThemeGradientId, ThemeGradient>
  background: Record<ThemeBackgroundId, ThemeBackground>
  scrollbar: Record<ThemeScrollbarId, ThemeScrollbar>
}

export type Theme = StaticTheme & {
  swatch: Record<ThemeSwatchId, ThemeSwatch>
}

export type ThemeSection =
  | "core"
  | "color"
  | "icon"
  | "background"
  | "borderWidth"
  | "corners"
  | "fontSize"
  | "fontWeight"
  | "fontFamily"
  | "font"
  | "lineHeight"
  | "margin"
  | "padding"
  | "gap"
  | "size"
  | "dimension"
  | "swatch"
  | "shadow"
  | "blur"
  | "spread"
  | "gradient"
  | "border"
  | "scrollbar"

export type ThemeBorderWidthId =
  | "xsmall"
  | "small"
  | "medium"
  | "large"
  | "xlarge"

export type ThemeCornersId = ThemeSpacingId

export type ThemeFontFamilyId = "primary" | "secondary"

export type ThemeFontId =
  | "display"
  | "heading"
  | "subheading"
  | "title"
  | "subtitle"
  | "callout"
  | "body"
  | "label"
  | "tagline"
  | "code"
  | `custom${number}`

export type ThemeFontSizeId =
  | "tiny"
  | "xxsmall"
  | "xsmall"
  | "small"
  | "medium"
  | "large"
  | "xlarge"
  | "xxlarge"
  | "huge"
  | `custom${number}`

export type ThemeFontWeightId =
  | "thin"
  | "xlight"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "xbold"
  | "black"

export type ThemeLineHeightId =
  | "solid"
  | "tight"
  | "compact"
  | "cozy"
  | "comfortable"
  | "open"
  | "none"

export type ThemeSizeId =
  | "tiny"
  | "xxsmall"
  | "xsmall"
  | "small"
  | "medium"
  | "large"
  | "xlarge"
  | "xxlarge"
  | "huge"

export type ThemeDimensionId =
  | "tiny"
  | "xxsmall"
  | "xsmall"
  | "small"
  | "medium"
  | "large"
  | "xlarge"
  | "xxlarge"
  | "huge"

export type ThemeSpacingId =
  | "tight"
  | "compact"
  | "cozy"
  | "comfortable"
  | "open"

export type ThemeStaticSwatchId = "background" | ThemeCustomSwatchId

export type ThemeSwatchId =
  | "white"
  | "gray"
  | "black"
  | "primary"
  | "swatch1"
  | "swatch2"
  | "swatch3"
  | "swatch4"
  | ThemeStaticSwatchId

export type ThemeCustomSwatchId = `custom${number}`

export type ThemeShadowId =
  | "xlight"
  | "light"
  | "moderate"
  | "strong"
  | "xstrong"
  | `custom${number}`

export type ThemeGradientId =
  | "primary"
  | "gradient1"
  | "gradient2"
  | `custom${number}`

export type ThemeBackgroundId =
  | "primary"
  | "background1"
  | "background2"
  | `custom${number}`

export type ThemeScrollbarId = "primary" | `custom${number}`

export type ThemeBorderId =
  | "hairline"
  | "thin"
  | "normal"
  | "normal"
  | "thick"
  | "bevel"
  | `custom${number}`

export type ThemeBackgroundKey = `@background.${ThemeBackgroundId}`
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

export type ThemeOptionId =
  | ThemeBackgroundId
  | ThemeSizeId
  | ThemeBorderId
  | ThemeBorderWidthId
  | ThemeCornersId
  | ThemeDimensionId
  | ThemeFontId
  | ThemeFontSizeId
  | ThemeFontWeightId
  | ThemeSpacingId
  | ThemeGradientId
  | ThemeLineHeightId
  | ThemeScrollbarId
  | ThemeShadowId
  | ThemeSizeId
  | ThemeSwatchId

export type ThemeValueKey =
  | ThemeBackgroundKey
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

export type ThemeId = StockThemeId | "custom"

export type StockThemeId =
  | "default"
  | "earth"
  | "industrial"
  | "material"
  | "pop"
  | "royal-azure"
  | "seldon"
  | "sky"
  | "sunset-blue"
  | "wildberry"
