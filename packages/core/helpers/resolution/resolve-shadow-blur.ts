import {
  PixelValue,
  RemValue,
  ShadowBlurValue,
  Unit,
  ValueType,
} from "../../index"
import { Theme } from "../../themes/types"
import { modulateWithTheme } from "../math/modulate"
import { getThemeOption } from "../theme/get-theme-option"

/**
 * Resolves shadow blur values to concrete PixelValue or RemValue
 *
 * @param blur - The shadow blur value to resolve
 * @param theme - The theme object containing shadow blur tokens
 * @returns The resolved shadow blur value
 */
export function resolveShadowBlur({
  blur,
  theme,
}: {
  blur: ShadowBlurValue
  theme: Theme
}): PixelValue | RemValue {
  switch (blur.type) {
    case ValueType.EXACT:
      return blur

    case ValueType.THEME_ORDINAL: {
      const themeValue = getThemeOption(blur.value, theme)

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
      // @ts-expect-error
      throw new Error(`Invalid blur type ${blur.type}`)
  }
}
