import {
  BorderWidth,
  BorderWidthHairlineValue,
  BorderWidthValue,
  EmptyValue,
  PixelValue,
  RemValue,
  Unit,
  ValueType,
} from "../../index"
import type { ComputeContext } from "../../properties/compute/types"
import { modulateWithTheme } from "../../themes/helpers/modulate"
import { Theme } from "../../themes/types"
import {
  isModulatedToken,
  isOptionToken,
  isThemeExactToken,
} from "../../themes/types"
import { getThemeOption } from "../theme/get-theme-option"

/**
 * Resolves border width values to concrete PixelValue, RemValue, BorderWidthHairlineValue, or EmptyValue.
 * Handles EMPTY, EXACT, OPTION, and THEME_ORDINAL value types.
 *
 * @param borderWidth - The border width value to resolve
 * @param theme - The theme object containing border width tokens
 * @param parentContext - The parent context for computed value resolution
 * @returns The resolved border width value
 */
export function resolveBorderWidth({
  borderWidth,
  theme,
  parentContext,
}: {
  borderWidth: BorderWidthValue
  theme: Theme
  parentContext?: ComputeContext | null
}): PixelValue | RemValue | BorderWidthHairlineValue | EmptyValue {
  switch (borderWidth.type) {
    case ValueType.EMPTY:
    case ValueType.EXACT:
    case ValueType.OPTION:
      return borderWidth
    case ValueType.THEME_ORDINAL: {
      const themeValue = getThemeOption(borderWidth.value as string, theme)

      if (isOptionToken(themeValue) && themeValue.parameters === "hairline") {
        return {
          type: ValueType.OPTION,
          value: BorderWidth.HAIRLINE,
        }
      }

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
        `Theme value ${borderWidth.value as string} must resolve to MODULATED or EXACT length`,
      )
    }
    default:
      throw new Error(
        `Invalid border width type ${(borderWidth as { type: string }).type}`,
      )
  }
}
