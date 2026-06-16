/**
 * Theme types — barrel only; see files for roles:
 * - `theme.ts` — StockTheme / ComputedTheme / ThemePipelineInput / ThemeOption (composite/document, parallels `properties.ts`)
 * - `theme-id.ts` — ThemeTemplateId / ThemeInstanceId (catalog instance ids)
 * - `theme-token-ids.ts` — ThemeTokenNamespace + per-table id literals + ThemeOptionId (parallels `property-keys.ts`)
 * - `theme-reference-keys.ts` — branded `@namespace.slot` keys (pairs with `properties/types/theme-reference-values.ts`)
 * - `schema.ts` — ThemeTokenSchema + token section ids (parallels `properties/types/schema.ts`)
 * - `helpers.ts` — `ThemeCustomKey`, `ThemeTokenTable`
 * - `../values/` — token cell shapes + type guards (`themes/values/shared/type-guards/theme-token-type-guards.ts` and siblings under `shared/`)
 * - `../constants/` — `TokenType`, `Harmony`, `Ratio` (parallels `properties/constants` for `ValueType` / enums)
 */
export * from "./helpers"

// Enums: canonical definitions live in `themes/constants`; re-exported here for one-stop theme imports.
export { Colorspace, Harmony, Ratio } from "../constants"

export { TokenType } from "../constants"

// Exact / modulated cells + compound token entries + guards (canonical: `themes/values`)
export type {
  BorderParameters,
  BorderWidthOption,
  FontParameters,
  GradientParameters,
  ModulationParameters,
  ScrollbarParameters,
  ShadowParameters,
  StockSwatchDynamic,
  StockThemeSwatch,
  ThemeBorder,
  ThemeBorderWidth,
  ThemeBorderWidthOption,
  ThemeFontFamilyToken,
  ThemeFont,
  ThemeGradient,
  ColorSpaceLiteral,
  ThemeExact,
  ThemeModulation,
  ThemePaletteSlot,
  ThemeScrollbar,
  ThemeShadow,
  ThemeScaleToken,
  ThemeSwatch,
  ThemeSwatchParameters,
} from "../values"

export { BORDER_WIDTH_OPTIONS } from "../values"

export {
  isDynamicSwatchToken,
  isFontFamilyToken,
  isLookToken,
  isModulatedToken,
  isOptionToken,
  isSwatchToken,
  isThemeExactNumberToken,
  isThemeExactToken,
} from "../values"

// Packaged theme catalog id + workspace custom
export type { ThemeInstanceId, ThemeTemplateId } from "./theme-id"

// Token table ids and `@` path segments
export type {
  BuiltInThemeClearedLookId,
  BuiltInThemeFontLookId,
  StockThemeBorderId,
  StockThemeFontId,
  StockThemeGradientId,
  StockThemeShadowId,
  ThemeBorderId,
  ThemeBorderWidthId,
  ThemeCornersId,
  ThemeCustomSwatchId,
  ThemeDimensionId,
  ThemeFontFamilyId,
  ThemeFontId,
  ThemeFontSizeId,
  ThemeFontWeightId,
  ThemeGradientId,
  ThemeLineHeightId,
  ThemeOptionId,
  ThemeScrollbarId,
  ThemeShadowId,
  ThemeSizeId,
  ThemeSpacingId,
  ThemeStaticSwatchId,
  ThemeSwatchId,
  ThemeTokenNamespace,
} from "./theme-token-ids"

// Branded @ reference keys
export type {
  ThemeBlurKey,
  ThemeBorderKey,
  ThemeBorderWidthKey,
  ThemeCornersKey,
  ThemeDimensionKey,
  ThemeFontFamilyKey,
  ThemeFontKey,
  ThemeFontSizeKey,
  ThemeFontWeightKey,
  ThemeGapKey,
  ThemeGradientKey,
  ThemeLineHeightKey,
  ThemeMarginKey,
  ThemePaddingKey,
  ThemeScrollbarKey,
  ThemeShadowKey,
  ThemeSizeKey,
  ThemeSpreadKey,
  ThemeSwatchKey,
  ThemeValueKey,
} from "./theme-reference-keys"

// Theme token schema catalog
export type {
  ThemeTokenBridgedCatalogDraft,
  ThemeTokenCatalogDraft,
  ThemeTokenSchema,
  ThemeTokenSchemaSupport,
  ThemeTokenSchemaUnresolved,
  ThemeTokenSchemaValidation,
  ThemeTokenSectionId,
  ThemeTokenSectionSchema,
} from "./schema"

// Stock authoring + complete theme + option union
export type {
  ComputedTheme,
  StockTheme,
  StockThemeSwatches,
  Theme,
  ThemeMetadata,
  ThemeOption,
  ThemePipelineInput,
} from "./theme"
