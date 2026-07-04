/**
 * `StockTheme` — packaged theme schema in `stock/` (incl. dynamic palette slots); `Theme` — computed tokens from `computeTheme`.
 */
import { IconSetId } from "../../icon-sets"
import { ColorValue } from "../../properties/values/appearance/color"
import { SizeValue } from "../../properties/values/appearance/size"
import {
  StockThemeSwatch,
  ThemeAutoFit,
  ThemeBorder,
  ThemeBorderWidth,
  ThemeColorHarmony,
  ThemeDisplayMode,
  ThemeExact,
  ThemeFont,
  ThemeFontFamilyGroup,
  ThemeFontFamilyToken,
  ThemeGradient,
  ThemeHighContrast,
  ThemeMatchColor,
  ThemeModulation,
  ThemeModulationGroup,
  ThemeOpticalPadding,
  ThemePaletteSlot,
  ThemeScaleToken,
  ThemeScrollbar,
  ThemeShadow,
  ThemeSwatch,
} from "../values"
import { ThemeTokenTable } from "./helpers"
import { ThemeInstanceId, ThemeTemplateId } from "./theme-id"
import {
  StockThemeBorderId,
  StockThemeFontId,
  StockThemeGradientId,
  StockThemeShadowId,
  ThemeBorderId,
  ThemeBorderWidthId,
  ThemeCornersId,
  ThemeDimensionId,
  ThemeFontId,
  ThemeFontSizeId,
  ThemeFontWeightId,
  ThemeGradientId,
  ThemeInterfaceSwatchId,
  ThemeLineHeightId,
  ThemeScrollbarId,
  ThemeShadowId,
  ThemeSizeId,
  ThemeSpacingId,
  ThemeSwatchId,
} from "./theme-token-ids"

type ThemeLookTableIdMap = {
  font: ThemeFontId
  border: ThemeBorderId
  gradient: ThemeGradientId
  shadow: ThemeShadowId
}

type StockThemeLookTableIdMap = {
  font: StockThemeFontId
  border: StockThemeBorderId
  gradient: StockThemeGradientId
  shadow: StockThemeShadowId
}

/**
 * Swatch table on a stock theme.
 * - Palette slots (`white, gray, black, primary, swatch1..4`) are required.
 * - The `background`, `foreground`, `offBlack`, and `offWhite` interface roles
 *   are required. They anchor light and dark surfaces and their readable text,
 *   so every theme must author them instead of inheriting the Seldon defaults.
 * - The remaining interface roles (`active, punch, ...`) are optional. A theme
 *   omits the ones it does not author; `computeTheme` fills them from the Seldon
 *   interface defaults.
 * - Free-named user swatches use the `custom1, custom2, ...` convention; their
 *   `name` field is the editor-visible label.
 */
export type StockThemeSwatches = ThemeTokenTable<
  ThemePaletteSlot | "background" | "foreground" | "offBlack" | "offWhite",
  StockThemeSwatch
> &
  Partial<
    Record<
      Exclude<
        ThemeInterfaceSwatchId,
        "background" | "foreground" | "offBlack" | "offWhite"
      >,
      StockThemeSwatch
    >
  >

export interface ThemeMetadata<TId extends string = ThemeTemplateId> {
  id: TId
  name: string
  description: string
  intent: string
}

type BaseTheme<
  TSwatch,
  TId extends string = ThemeTemplateId,
  TLookIds extends ThemeLookTableIdMap = ThemeLookTableIdMap,
> = {
  metadata: ThemeMetadata<TId>
  modulation: ThemeModulationGroup
  colorHarmony: ThemeColorHarmony
  displayMode: ThemeDisplayMode
  matchColor: ThemeMatchColor
  highContrast: ThemeHighContrast
  opticalPadding: ThemeOpticalPadding
  autoFit: ThemeAutoFit
  size: ThemeTokenTable<ThemeSizeId, ThemeScaleToken>
  dimension: ThemeTokenTable<ThemeDimensionId, ThemeScaleToken>
  margin: ThemeTokenTable<ThemeSpacingId, ThemeScaleToken>
  padding: ThemeTokenTable<ThemeSpacingId, ThemeScaleToken>
  gap: ThemeTokenTable<ThemeSpacingId, ThemeScaleToken>
  corners: ThemeTokenTable<ThemeCornersId, ThemeScaleToken>
  swatch: TSwatch
  fontFamily: ThemeFontFamilyGroup
  fontSize: ThemeTokenTable<ThemeFontSizeId, ThemeScaleToken>
  fontWeight: ThemeTokenTable<ThemeFontWeightId, ThemeExact>
  lineHeight: ThemeTokenTable<ThemeLineHeightId, ThemeExact>
  font: ThemeTokenTable<TLookIds["font"], ThemeFont>
  borderWidth: ThemeTokenTable<ThemeBorderWidthId, ThemeBorderWidth>
  border: ThemeTokenTable<TLookIds["border"], ThemeBorder>
  iconSet: {
    intent: string
    set: IconSetId
    defaultColor: ColorValue
    defaultSize: SizeValue
  }
  gradient: ThemeTokenTable<TLookIds["gradient"], ThemeGradient>
  blur: ThemeTokenTable<ThemeSizeId, ThemeScaleToken>
  spread: ThemeTokenTable<ThemeSizeId, ThemeScaleToken>
  shadow: ThemeTokenTable<TLookIds["shadow"], ThemeShadow>
  scrollbar: ThemeTokenTable<ThemeScrollbarId, ThemeScrollbar>
}

/** Packaged theme schema (`stock/`); palette slots use `StockThemeSwatch` (incl. `TokenType.DYNAMIC_SWATCH`). */
export type StockTheme = BaseTheme<
  StockThemeSwatches,
  ThemeTemplateId,
  StockThemeLookTableIdMap
>

/** Complete theme in memory, including generated swatch slots and optional `custom` id. */
export type ComputedTheme = BaseTheme<
  ThemeTokenTable<ThemeSwatchId, ThemeSwatch>,
  ThemeInstanceId,
  ThemeLookTableIdMap
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
  | ThemeScrollbar
  | StockThemeSwatch
  | ThemeSwatch
  | ThemeScaleToken
  | ThemeFontFamilyToken
