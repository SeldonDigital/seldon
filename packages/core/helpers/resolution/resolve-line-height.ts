import type { ComputeContext } from "../../properties/compute/types"
import {
  EmptyValue,
  LineHeightThemeValue,
  LineHeightValue,
  NumberValue,
  Unit,
  ValueType,
} from "../../index"
import type { Theme } from "../../themes/types"
import type { ThemeExact } from "../../themes/values"
import { getThemeOption } from "../theme/get-theme-option"

/**
 * Resolves line height values to concrete NumberValue or EmptyValue.
 * Handles EMPTY, EXACT, and THEME_ORDINAL value types.
 *
 * @param lineHeight - The line height value to resolve
 * @param theme - The theme object containing line height tokens
 * @param parentContext - The parent context for computed value resolution
 * @returns The resolved line height value
 */
export function resolveLineHeight({
  lineHeight,
  theme,
  parentContext,
}: {
  lineHeight: LineHeightValue | EmptyValue
  theme: Theme
  parentContext?: ComputeContext | null
}): Exclude<LineHeightValue, LineHeightThemeValue> | EmptyValue {
  switch (lineHeight.type) {
    case ValueType.EMPTY:
    case ValueType.EXACT:
      return lineHeight as
        | Exclude<LineHeightValue, LineHeightThemeValue>
        | EmptyValue
    case ValueType.THEME_ORDINAL: {
      const themeValue = getThemeOption(
        lineHeight.value as string,
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
        `Invalid line height type ${(lineHeight as { type: string }).type}`,
      )
  }
}
