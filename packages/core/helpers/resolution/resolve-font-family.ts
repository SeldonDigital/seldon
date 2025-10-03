import { ValueType } from "../../properties/constants/value-types"
import { EmptyValue } from "../../properties/values/shared/empty"
import {
  FontFamilyPresetValue,
  FontFamilyValue,
} from "../../properties/values/typography/font/font-family"
import { Theme } from "../../themes/types"
import { isEmptyValue } from "../type-guards/value/is-empty-value"

/**
 * Resolves font family values to concrete FontFamilyPresetValue or undefined
 *
 * @param fontFamily - The font family value to resolve
 * @param theme - The theme object containing font family tokens
 * @returns The resolved font family value or undefined
 */
export function resolveFontFamily({
  fontFamily,
  theme,
}: {
  fontFamily:
    | FontFamilyValue
    | EmptyValue
    | undefined
    | { type: ValueType.COMPUTED; value: unknown }
  theme: Theme
}): FontFamilyPresetValue | undefined {
  if (!fontFamily) return undefined

  if (fontFamily.type === ValueType.COMPUTED) {
    throw new Error("resolveFontFamily received a COMPUTED value")
  }

  if (isEmptyValue(fontFamily)) return undefined

  if (fontFamily.type === ValueType.PRESET) {
    return fontFamily
  }

  if (fontFamily.type === ValueType.THEME_CATEGORICAL) {
    if (fontFamily.value === "@fontFamily.primary") {
      return {
        type: ValueType.PRESET,
        value: theme.fontFamily.primary,
      }
    }

    if (fontFamily.value === "@fontFamily.secondary") {
      return {
        type: ValueType.PRESET,
        value: theme.fontFamily.secondary,
      }
    }

    throw new Error(`Theme value ${fontFamily.value} not found`)
  }

  const _exhaustiveCheck: never = fontFamily
  throw new Error("Invalid font family type")
}
