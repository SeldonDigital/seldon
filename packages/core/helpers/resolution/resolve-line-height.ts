import {
  EmptyValue,
  LineHeightThemeValue,
  LineHeightValue,
  NumberValue,
  Unit,
  ValueType,
} from "../../index"
import { Theme } from "../../themes/types"
import { getThemeOption } from "../theme/get-theme-option"

/**
 * Resolves line height values to concrete NumberValue or EmptyValue
 *
 * @param lineHeight - The line height value to resolve
 * @param theme - The theme object containing line height tokens
 * @returns The resolved line height value
 */
export function resolveLineHeight({
  lineHeight,
  theme,
}: {
  lineHeight: LineHeightValue | EmptyValue
  theme: Theme
}): Exclude<LineHeightValue, LineHeightThemeValue> | EmptyValue {
  switch (lineHeight.type) {
    case ValueType.EXACT:
    case ValueType.EMPTY:
      return lineHeight

    case ValueType.THEME_ORDINAL: {
      const themeValue = getThemeOption(lineHeight.value, theme)

      return {
        type: ValueType.EXACT,
        value: { value: themeValue.value, unit: Unit.NUMBER },
      } as NumberValue
    }

    default:
      // @ts-expect-error
      throw new Error(`Invalid line height type ${lineHeight.type}`)
  }
}
