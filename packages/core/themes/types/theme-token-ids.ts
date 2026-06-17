/**
 * Literal unions for slot ids on `StockTheme` / `Theme` token tables.
 * For `@namespace.slot` reference strings, see `theme-reference-keys.ts`.
 * For which packaged theme row is active, see `theme-id.ts` (`ThemeInstanceId` / `ThemeTemplateId`).
 */

/** First segment of a `@namespace.option` theme reference (distinct from `ThemeTokenSectionId`). */
export type ThemeTokenNamespace =
  | "core"
  | "color"
  | "iconSet"
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
  | `custom${number}`

export type ThemeCornersId = ThemeSpacingId

export type ThemeFontFamilyId = "primary" | "secondary"

/** Cleared font look injected at compute time; not authored in `stock/`. */
export type BuiltInThemeFontLookId = "normal"

export type ThemeFontId =
  | BuiltInThemeFontLookId
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
  | `custom${number}`

export type ThemeLineHeightId =
  | "solid"
  | "tight"
  | "compact"
  | "cozy"
  | "comfortable"
  | "open"
  | "none"
  | `custom${number}`

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
  | `custom${number}`

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
  | `custom${number}`

export type ThemeSpacingId =
  | "tight"
  | "compact"
  | "cozy"
  | "comfortable"
  | "open"
  | `custom${number}`

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

/** Cleared look injected at compute time; not authored in `stock/`. */
export type BuiltInThemeClearedLookId = "none"

export type ThemeShadowId =
  | BuiltInThemeClearedLookId
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

export type ThemeScrollbarId = "primary" | `custom${number}`

export type ThemeBorderId =
  | BuiltInThemeClearedLookId
  | "hairline"
  | "thin"
  | "normal"
  | "thick"
  | "bevel"
  | `custom${number}`

export type StockThemeFontId = Exclude<ThemeFontId, BuiltInThemeFontLookId>
export type StockThemeShadowId = Exclude<
  ThemeShadowId,
  BuiltInThemeClearedLookId
>
export type StockThemeGradientId = Exclude<
  ThemeGradientId,
  BuiltInThemeClearedLookId
>
export type StockThemeBorderId = Exclude<
  ThemeBorderId,
  BuiltInThemeClearedLookId
>

export type ThemeOptionId =
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
  | ThemeSwatchId
