import { ComputeContext } from "../../compute/types"
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
import { TransparentValue } from "../../properties/values/shared/exact/transparent"
import { Theme } from "../../themes/types"
import { getThemeOption } from "../theme/get-theme-option"

/**
 * Resolves color values to concrete HSLValue, RGBValue, HexValue, LCHValue, TransparentValue, or EmptyValue.
 * Handles EMPTY, EXACT, PRESET, and THEME_CATEGORICAL value types.
 *
 * @param color - The color value to resolve
 * @param theme - The theme object containing color tokens
 * @param parentContext - The parent context for computed value resolution
 * @returns The resolved color value
 */
export function resolveColor({
  color,
  theme,
  parentContext,
}: {
  color: ColorValue | EmptyValue
  theme: Theme
  parentContext?: ComputeContext | null
}): HSLValue | RGBValue | HexValue | LCHValue | TransparentValue | EmptyValue {
  // Validate that the color has a valid type
  if (!color || typeof color !== "object" || !color.type) {
    console.warn(
      `Invalid color object: ${JSON.stringify(color)}. Falling back to empty value.`,
    )
    return { type: ValueType.EMPTY, value: null }
  }

  switch (color.type) {
    case ValueType.EMPTY:
    case ValueType.EXACT:
    case ValueType.PRESET:
      return color
    case ValueType.COMPUTED:
      throw new Error(
        `resolveColor received a COMPUTED value. This should have been computed in the compute function.`,
      )
    case ValueType.THEME_CATEGORICAL:
      const themeValue = getThemeOption(color.value as string, theme)
      invariant(themeValue, `Theme value ${color.value} not found`)
      return {
        type: ValueType.EXACT,
        value: (themeValue as any).value,
      }
    default:
      console.warn(
        `Invalid color type: ${(color as any).type}. Falling back to empty value.`,
      )
      return { type: ValueType.EMPTY, value: null }
  }
}
