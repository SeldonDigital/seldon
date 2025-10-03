import {
  ColorValue,
  EmptyValue,
  HSLValue,
  HexValue,
  LCHValue,
  RGBValue,
  ValueType,
  invariant,
} from "../../index"
import { TransparentValue } from "../../properties/values/color/transparent"
import { Theme } from "../../themes/types"
import { getThemeOption } from "../theme/get-theme-option"

/**
 * Resolves color values to concrete HSLValue, RGBValue, HexValue, LCHValue, TransparentValue, or EmptyValue
 *
 * @param color - The color value to resolve
 * @param theme - The theme object containing color tokens
 * @returns The resolved color value
 */
export function resolveColor({
  color,
  theme,
}: {
  color: ColorValue | EmptyValue
  theme: Theme
}): HSLValue | RGBValue | HexValue | LCHValue | TransparentValue | EmptyValue {
  switch (color.type) {
    case ValueType.EXACT:
    case ValueType.EMPTY:
    case ValueType.PRESET:
      return color
    case ValueType.COMPUTED:
      throw new Error(
        `resolveColor received a COMPUTED value. This should have been computed in the compute function.`,
      )
    case ValueType.THEME_CATEGORICAL:
      const themeValue = getThemeOption(color.value, theme)
      invariant(themeValue, `Theme value ${color.value} not found`)
      return {
        type: ValueType.EXACT,
        value: themeValue.value,
      }
    default:
      // @ts-expect-error
      throw new Error(`Invalid color type ${color.type}`)
  }
}
