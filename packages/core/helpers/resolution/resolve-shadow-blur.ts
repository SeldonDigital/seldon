import {
  EmptyValue,
  PixelValue,
  RemValue,
  ShadowBlurValue,
  Unit,
  ValueType,
} from "../../index"
import type { ComputeContext } from "../../properties/compute/types"
import { modulateWithTheme } from "../../themes/helpers/modulate"
import { Theme } from "../../themes/types"
import { isModulatedToken, isThemeExactToken } from "../../themes/types"
import { getThemeOption } from "../theme/get-theme-option"

/**
 * Resolves shadow blur values to concrete PixelValue or RemValue.
 * Handles EMPTY, EXACT, and THEME_ORDINAL value types.
 *
 * @param blur - The shadow blur value to resolve
 * @param theme - The theme object containing shadow blur tokens
 * @param parentContext - The parent context for computed value resolution
 * @returns The resolved shadow blur value
 */
export function resolveShadowBlur({
  blur,
  theme,
  parentContext,
}: {
  blur: ShadowBlurValue
  theme: Theme
  parentContext?: ComputeContext | null
}): PixelValue | RemValue | EmptyValue {
  switch (blur.type) {
    case ValueType.EMPTY:
      return blur as EmptyValue
    case ValueType.EXACT:
      return blur as PixelValue | RemValue
    case ValueType.THEME_ORDINAL: {
      const themeValue = getThemeOption(blur.value as string, theme)
      if (isModulatedToken(themeValue)) {
        const n = modulateWithTheme({
          theme,
          parameters: themeValue.parameters,
        })
        return {
          type: ValueType.EXACT,
          value: { unit: Unit.REM, value: n },
        }
      }
      if (isThemeExactToken(themeValue)) {
        const { unit, value: n } = themeValue.parameters
        return (
          unit === Unit.PX
            ? { type: ValueType.EXACT, value: { unit: Unit.PX, value: n } }
            : { type: ValueType.EXACT, value: { unit: Unit.REM, value: n } }
        ) as PixelValue | RemValue
      }
      throw new Error(
        `Theme value ${blur.value as string} must resolve to MODULATED or EXACT length`,
      )
    }
    default:
      throw new Error(`Invalid blur type ${(blur as { type: string }).type}`)
  }
}
