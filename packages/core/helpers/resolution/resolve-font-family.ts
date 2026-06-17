import { ValueType } from "../../properties"
import type { ComputeContext } from "../../properties/compute/types"
import { EmptyValue } from "../../properties/values/shared/empty/empty"
import {
  FontFamilyPresetValue,
  FontFamilyValue,
} from "../../properties/values/typography/font/font-family"
import { TokenType } from "../../themes/constants/token-type"
import { Theme } from "../../themes/types"
import { getThemeOption } from "../theme/get-theme-option"

/**
 * Resolves font family values to concrete FontFamilyPresetValue or undefined.
 * Handles EMPTY, INHERIT, EXACT, OPTION, and THEME_CATEGORICAL value types.
 *
 * @param fontFamily - The font family value to resolve
 * @param theme - The theme object containing font family tokens
 * @returns The resolved font family value or undefined
 */
export function resolveFontFamily({
  fontFamily,
  theme,
  parentContext: _parentContext,
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

  if (fontFamily.type === ValueType.COMPUTED) {
    throw new Error(
      `resolveFontFamily received a COMPUTED value. This should have been computed in the compute function.`,
    )
  }

  const fontFamilyTyped = fontFamily as FontFamilyValue | EmptyValue

  switch (fontFamilyTyped.type) {
    case ValueType.EMPTY:
      return undefined
    case ValueType.INHERIT:
      return undefined
    case ValueType.OPTION:
      return {
        type: ValueType.OPTION,
        value: fontFamilyTyped.value as string,
      }
    case ValueType.THEME_CATEGORICAL: {
      const themeValue = getThemeOption(fontFamilyTyped.value as string, theme)
      const stack =
        themeValue.type === TokenType.FONT_FAMILY
          ? themeValue.parameters
          : String(themeValue)
      return {
        type: ValueType.OPTION,
        value: stack,
      }
    }
    case ValueType.EXACT:
      return {
        type: ValueType.OPTION,
        value: fontFamilyTyped.value as string,
      }
    default:
      throw new Error(
        `Invalid font family type ${(fontFamilyTyped as { type: string }).type}`,
      )
  }
}
