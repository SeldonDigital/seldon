import type { ComputeContext } from "../../properties/compute/types"
import {
  FontWeightThemeValue,
  FontWeightValue,
  NumberValue,
  Unit,
  ValueType,
} from "../../index"
import type { Theme } from "../../themes/types"
import type { ThemeExact } from "../../themes/values"
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
      const themeValue = getThemeOption(
        fontWeight.value as string,
        theme,
      ) as ThemeExact

      return {
        type: ValueType.EXACT,
        value: {
          value: themeValue.value.value,
          unit: Unit.NUMBER,
        },
      }
    }
    default:
      throw new Error(
        `Invalid font weight type ${(fontWeight as { type: string }).type}`,
      )
  }
}
