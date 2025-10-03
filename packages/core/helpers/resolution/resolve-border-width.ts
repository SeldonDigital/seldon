import {
  BorderWidth,
  BorderWidthHairlineValue,
  BorderWidthValue,
  PixelValue,
  RemValue,
  Unit,
  ValueType,
} from "../../index"
import { Theme } from "../../themes/types"
import { modulateWithTheme } from "../math/modulate"
import { getThemeOption } from "../theme/get-theme-option"

/**
 * Resolves border width values to concrete PixelValue, RemValue, or BorderWidthHairlineValue
 *
 * @param borderWidth - The border width value to resolve
 * @param theme - The theme object containing border width tokens
 * @returns The resolved border width value
 */
export function resolveBorderWidth({
  borderWidth,
  theme,
}: {
  borderWidth: BorderWidthValue
  theme: Theme
}): PixelValue | RemValue | BorderWidthHairlineValue {
  switch (borderWidth.type) {
    case ValueType.EXACT:
    case ValueType.PRESET:
      return borderWidth

    case ValueType.THEME_ORDINAL: {
      const themeValue = getThemeOption(borderWidth.value, theme)

      if (themeValue.value === "hairline") {
        return {
          type: ValueType.PRESET,
          value: BorderWidth.HAIRLINE,
        }
      }

      return {
        type: ValueType.EXACT,
        value: {
          unit: Unit.REM,
          value: modulateWithTheme({
            theme,
            parameters: themeValue.parameters,
          }),
        },
      }
    }

    default:
      throw new Error(`Invalid border width type ${borderWidth.type}`)
  }
}
