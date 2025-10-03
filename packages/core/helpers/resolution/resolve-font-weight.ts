import {
  FontWeightThemeValue,
  FontWeightValue,
  NumberValue,
  Unit,
  ValueType,
} from "../../index"
import { Theme } from "../../themes/types"
import { getThemeOption } from "../theme/get-theme-option"

/**
 * Resolves font weight values to concrete NumberValue
 *
 * @param fontWeight - The font weight value to resolve
 * @param theme - The theme object containing font weight tokens
 * @returns The resolved font weight value
 */
export function resolveFontWeight({
  fontWeight,
  theme,
}: {
  fontWeight: FontWeightValue
  theme: Theme
}): Exclude<FontWeightValue, FontWeightThemeValue> {
  switch (fontWeight.type) {
    case ValueType.EXACT:
      return fontWeight

    case ValueType.THEME_ORDINAL: {
      const themeValue = getThemeOption(fontWeight.value, theme)

      return {
        type: ValueType.EXACT,
        value: { value: themeValue.value, unit: Unit.NUMBER },
      } as NumberValue
    }

    default:
      // @ts-expect-error
      throw new Error(`Invalid font weight type ${fontWeight.type}`)
  }
}
