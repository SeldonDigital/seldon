/**
 * `StockTheme` — packaged theme schema in `stock/` (incl. dynamic palette slots); `Theme` — computed tokens from `computeTheme`.
 */
import { IconSetId } from "../../icons"
import { ColorValue } from "../../properties/values/appearance/color"
import { SizeValue } from "../../properties/values/appearance/size"
import { Harmony, Ratio } from "../constants"
import {
  ColorSpaceLiteral,
  StockThemeSwatch,
  ThemeBackground,
  ThemeBorder,
  ThemeBorderWidth,
  ThemeFontFamilyToken,
  ThemeExact,
  ThemeFont,
  ThemeGradient,
  ThemeModulation,
  ThemePaletteSlot,
  ThemeScaleToken,
  ThemeScrollbar,
  ThemeShadow,
  ThemeSwatch,
} from "../values"
import { ThemeTokenTable } from "./helpers"
import { ThemeInstanceId, ThemeTemplateId } from "./theme-id"
import {
  ThemeBackgroundId,
  ThemeBorderId,
  ThemeBorderWidthId,
  ThemeCornersId,
  ThemeDimensionId,
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

/**
 * Swatch table on a stock theme.
 * - Palette slots (`white, gray, black, primary, swatch1..4`) and the reserved
 *   `background` slot are required.
 * - Free-named user swatches use the `custom1, custom2, ...` convention; their
 *   `name` field is the editor-visible label.
 */
export type StockThemeSwatches = ThemeTokenTable<
  ThemePaletteSlot | "background",
  StockThemeSwatch
>

export interface ThemeMetadata<TId extends string = ThemeTemplateId> {
  id: TId
  name: string
  description: string
  intent: string
}

type BaseTheme<TSwatch, TId extends string = ThemeTemplateId> = {
  metadata: ThemeMetadata<TId>
  core: {
    ratio: Ratio
    fontSize: number
    size: number
  }
  size: ThemeTokenTable<ThemeSizeId, ThemeScaleToken>
  dimension: ThemeTokenTable<ThemeDimensionId, ThemeScaleToken>
  margin: ThemeTokenTable<ThemeSpacingId, ThemeScaleToken>
  padding: ThemeTokenTable<ThemeSpacingId, ThemeScaleToken>
  gap: ThemeTokenTable<ThemeSpacingId, ThemeScaleToken>
  corners: ThemeTokenTable<ThemeCornersId, ThemeScaleToken>
  color: {
    baseColor: ColorSpaceLiteral
    harmony: Harmony
    angle: number
    step: number
    whitePoint: number
    grayPoint: number
    blackPoint: number
    bleed: number
    contrastRatio: number
  }
  swatch: TSwatch
  fontFamily: {
    primary: ThemeFontFamilyToken
    secondary: ThemeFontFamilyToken
  }
  fontSize: ThemeTokenTable<ThemeFontSizeId, ThemeScaleToken>
  fontWeight: ThemeTokenTable<ThemeFontWeightId, ThemeExact>
  lineHeight: ThemeTokenTable<ThemeLineHeightId, ThemeExact>
  font: ThemeTokenTable<ThemeFontId, ThemeFont>
  borderWidth: ThemeTokenTable<ThemeBorderWidthId, ThemeBorderWidth>
  border: ThemeTokenTable<ThemeBorderId, ThemeBorder>
  iconSet: {
    intent: string
    set: IconSetId
    defaultColor: ColorValue
    defaultSize: SizeValue
  }
  background: ThemeTokenTable<ThemeBackgroundId, ThemeBackground>
  gradient: ThemeTokenTable<ThemeGradientId, ThemeGradient>
  blur: ThemeTokenTable<ThemeSizeId, ThemeScaleToken>
  spread: ThemeTokenTable<ThemeSizeId, ThemeScaleToken>
  shadow: ThemeTokenTable<ThemeShadowId, ThemeShadow>
  scrollbar: ThemeTokenTable<ThemeScrollbarId, ThemeScrollbar>
}

/** Packaged theme schema (`stock/`); palette slots use `StockThemeSwatch` (incl. `TokenType.DYNAMIC_SWATCH`). */
export type StockTheme = BaseTheme<StockThemeSwatches, ThemeTemplateId>

/** Complete theme in memory, including generated swatch slots and optional `custom` id. */
export type ComputedTheme = BaseTheme<
  ThemeTokenTable<ThemeSwatchId, ThemeSwatch>,
  ThemeInstanceId
> & {
  id: ThemeInstanceId
  swatch: ThemeTokenTable<ThemeSwatchId, ThemeSwatch>
}

export type Theme = ComputedTheme

/** Valid input to `normalizeThemeInput` / `computeTheme`: stock schema or resolved `Theme`. */
export type ThemePipelineInput = StockTheme | ComputedTheme

export type ThemeOption =
  | ThemeBorderWidth
  | ThemeModulation
  | ThemeExact
  | ThemeFont
  | ThemeShadow
  | ThemeBorder
  | ThemeGradient
  | ThemeBackground
  | ThemeScrollbar
  | StockThemeSwatch
  | ThemeSwatch
  | ThemeScaleToken
  | ThemeFontFamilyToken
