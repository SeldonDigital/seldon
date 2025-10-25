/**
 * THEME VALUE TYPES
 *
 * This file defines theme value types - atomic values that reference design tokens
 * from the theme system. Theme values are a subset of atomic values that specifically
 * reference theme tokens using the "@" prefix (e.g., "@swatch.primary", "@fontSize.large").
 *
 * THEME VALUE CATEGORIES:
 *
 * 1. THEME_CATEGORICAL: Non-sequential theme references
 *    - Examples: @swatch.primary, @swatch.secondary, @border.solid
 *    - Usage: These reference named design tokens that don't have a natural order
 *
 * 2. THEME_ORDINAL: Sequential theme references
 *    - Examples: @fontSize.small, @fontSize.medium, @fontSize.large
 *    - Usage: These reference design tokens that have a natural progression
 *
 * RELATIONSHIP TO OTHER VALUE TYPES:
 * - AtomicValue: All individual values including theme variants (value-atomic.ts)
 * - CompoundValue: Properties with sub-properties (value-compound.ts)
 * - ThemeValue: Theme-specific atomic values (this file)
 *
 * USAGE PATTERNS:
 * - For theme migration: Use ThemeValue to identify properties that need theme updates
 * - For validation: Use ThemeValue to validate theme token references
 * - For type guards: Use ThemeValue to check if a value references theme tokens
 * - For resolution: Use ThemeValue to resolve theme tokens to actual values
 *
 * @example
 * // Theme categorical values
 * const primaryColor: ThemeValue = { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" }
 * const solidBorder: ThemeValue = { type: ValueType.THEME_CATEGORICAL, value: "@border.solid" }
 *
 * // Theme ordinal values
 * const mediumFontSize: ThemeValue = { type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" }
 * const largeMargin: ThemeValue = { type: ValueType.THEME_ORDINAL, value: "@margin.large" }
 */
import {
  BackgroundPresetValue,
  BorderPresetValue,
  ColorThemeValue,
  CornerThemeValue,
  DimensionThemeValue,
  FontPresetValue,
  FontSizeThemeValue,
  FontWeightThemeValue,
  GapThemeValue,
  GradientPresetValue,
  LineHeightThemeValue,
  MarginSideThemeValue,
  PaddingSideThemeValue,
  ShadowBlurThemeValue,
  ShadowPresetValue,
  SizeThemeValue,
} from "../values"

/**
 * ThemeValue represents all theme related atomic value types.
 *
 * Theme values are atomic values that reference design tokens from the theme system.
 * They use the "@" prefix to reference theme tokens and are resolved to actual values
 * during the computation phase.
 *
 * @example
 * // Layout theme values
 * const margin: ThemeValue = { type: ValueType.THEME_ORDINAL, value: "@margin.medium" }
 * const padding: ThemeValue = { type: ValueType.THEME_ORDINAL, value: "@padding.large" }
 *
 * // Appearance theme values
 * const color: ThemeValue = { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" }
 * const border: ThemeValue = { type: ValueType.THEME_CATEGORICAL, value: "@border.solid" }
 *
 * // Typography theme values
 * const fontSize: ThemeValue = { type: ValueType.THEME_ORDINAL, value: "@fontSize.large" }
 * const fontFamily: ThemeValue = { type: ValueType.THEME_CATEGORICAL, value: "@fontFamily.primary" }
 */
export type ThemeValue =
  // ========================================
  // LAYOUT
  // ========================================
  | DimensionThemeValue // Theme dimensions (@dimension.small, @dimension.large)
  | GapThemeValue // Theme gaps (@gap.tight, @gap.comfortable)
  | MarginSideThemeValue // Theme margins (@margin.small, @margin.large)
  | PaddingSideThemeValue // Theme paddings (@padding.small, @padding.large)
  | SizeThemeValue // Theme sizes (@size.small, @size.large)

  // ========================================
  // APPEARANCE
  // ========================================
  | ColorThemeValue // Theme colors (@swatch.primary, @swatch.secondary)
  | BackgroundPresetValue // Theme background presets (@background.solid, @background.gradient)
  | BorderPresetValue // Theme border presets (@border.solid, @border.dashed)
  | CornerThemeValue // Theme corner radius (@corners.small, @corners.large)

  // ========================================
  // TYPOGRAPHY
  // ========================================
  | FontPresetValue // Theme font presets (@font.title, @font.body)
  | FontSizeThemeValue // Theme font sizes (@fontSize.small, @fontSize.large)
  | FontWeightThemeValue // Theme font weights (@fontWeight.normal, @fontWeight.bold)
  | LineHeightThemeValue // Theme line heights (@lineHeight.tight, @lineHeight.relaxed)

  // ========================================
  // GRADIENTS
  // ========================================
  | GradientPresetValue // Theme gradient presets (@gradient.primary, @gradient.secondary)

  // ========================================
  // EFFECTS
  // ========================================
  | ShadowPresetValue // Theme shadow presets (@shadow.small, @shadow.large)
  | ShadowBlurThemeValue // Theme shadow blur values (@shadowBlur.small, @shadowBlur.large)
