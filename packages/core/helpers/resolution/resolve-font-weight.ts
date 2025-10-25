import { ComputeContext } from "../../compute/types"
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
 * Resolves font weight values to concrete NumberValue or EmptyValue.
 * Handles EMPTY, EXACT, and THEME_ORDINAL value types.
 *
 * @param fontWeight - The font weight value to resolve
 * @param theme - The theme object containing font weight tokens
 * @param parentContext - The parent context for computed value resolution
 * @returns The resolved font weight value
 */
export function resolveFontWeight({
  fontWeight,
  theme,
  parentContext,
}: {
  fontWeight: FontWeightValue
  theme: Theme
  parentContext?: ComputeContext | null
}): Exclude<FontWeightValue, FontWeightThemeValue> {
  switch (fontWeight.type) {
    case ValueType.EMPTY:
    case ValueType.EXACT:
      return fontWeight as Exclude<FontWeightValue, FontWeightThemeValue>
    case ValueType.THEME_ORDINAL: {
      const themeValue = getThemeOption(fontWeight.value as string, theme)

      return {
        type: ValueType.EXACT,
        value: { value: (themeValue as any).value, unit: Unit.NUMBER },
      }
    }
    default:
      throw new Error(
        `Invalid font weight type ${(fontWeight as { type: string }).type}`,
      )
  }
}
