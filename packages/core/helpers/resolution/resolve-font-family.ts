import { ComputeContext } from "../../compute/types"
import { ValueType } from "../../properties"
import { EmptyValue } from "../../properties/values/shared/empty/empty"
import {
  FontFamilyPresetValue,
  FontFamilyValue,
} from "../../properties/values/typography/font/font-family"
import { Theme } from "../../themes/types"
import { getThemeOption } from "../theme/get-theme-option"

/**
 * Resolves font family values to concrete FontFamilyPresetValue or undefined.
 * Handles EMPTY, EXACT, PRESET, and THEME_CATEGORICAL value types.
 *
 * @param fontFamily - The font family value to resolve
 * @param theme - The theme object containing font family tokens
 * @param parentContext - The parent context for computed value resolution
 * @returns The resolved font family value or undefined
 */
export function resolveFontFamily({
  fontFamily,
  theme,
  parentContext,
}: {
  fontFamily:
    | FontFamilyValue
    | EmptyValue
    | undefined
    | { type: ValueType.COMPUTED; value: unknown }
  theme: Theme
  parentContext?: ComputeContext | null
}): FontFamilyPresetValue | undefined {
  if (!fontFamily) return undefined

  // Handle computed values first to narrow the type
  if (fontFamily.type === ValueType.COMPUTED) {
    throw new Error(
      `resolveFontFamily received a COMPUTED value. This should have been computed in the compute function.`,
    )
  }

  // Type assertion to help TypeScript narrow the type
  const fontFamilyTyped = fontFamily as
    | FontFamilyValue
    | EmptyValue
    | { type: ValueType.EXACT; value: string }

  switch (fontFamilyTyped.type) {
    case ValueType.EMPTY:
      return undefined
    case ValueType.PRESET:
      return fontFamilyTyped as FontFamilyPresetValue
    case ValueType.THEME_CATEGORICAL:
      const themeValue = getThemeOption(fontFamilyTyped.value as string, theme)
      return {
        type: ValueType.PRESET,
        value: themeValue as string,
      }
    case ValueType.EXACT:
      // Handle exact values that aren't part of FontFamilyValue
      return {
        type: ValueType.PRESET,
        value: fontFamilyTyped.value as string,
      }
    default:
      throw new Error(
        `Invalid font family type ${(fontFamilyTyped as { type: string }).type}`,
      )
  }
}
