import { ComputeContext } from "../../compute/types"
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
import { Theme } from "../../themes/types"
import { modulateWithTheme } from "../math/modulate"
import { getThemeOption } from "../theme/get-theme-option"

/**
 * Resolves border width values to concrete PixelValue, RemValue, BorderWidthHairlineValue, or EmptyValue.
 * Handles EMPTY, EXACT, PRESET, and THEME_ORDINAL value types.
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
    case ValueType.PRESET:
      return borderWidth
    case ValueType.THEME_ORDINAL: {
      const themeValue = getThemeOption(borderWidth.value as string, theme)

      if ((themeValue as any).value === "hairline") {
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
            parameters: (themeValue as any).parameters,
          }),
        },
      }
    }
    default:
      throw new Error(
        `Invalid border width type ${(borderWidth as { type: string }).type}`,
      )
  }
}
