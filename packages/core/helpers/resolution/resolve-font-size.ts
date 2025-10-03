import {
  EmptyValue,
  FontSizeValue,
  PixelValue,
  Properties,
  RemValue,
  Unit,
  ValueType,
  invariant,
} from "../../index"
import { Theme } from "../../themes/types"
import { modulate } from "../math/modulate"
import { getThemeOption } from "../theme/get-theme-option"

/**
 * Resolves font size values to concrete PixelValue, RemValue, or EmptyValue
 *
 * @param fontSize - The font size value to resolve
 * @param theme - The theme object containing font size tokens
 * @returns The resolved font size value
 */
export function resolveFontSize({
  fontSize,
  theme,
}: {
  fontSize: FontSizeValue | EmptyValue
  theme: Theme
}): PixelValue | RemValue | EmptyValue {
  switch (fontSize.type) {
    case ValueType.EXACT:
    case ValueType.EMPTY:
      return fontSize
    case ValueType.COMPUTED:
      throw new Error(
        `resolveFontSize received a COMPUTED value. This should have been computed in the compute function.`,
      )
    case ValueType.THEME_ORDINAL:
      const themeValue = getThemeOption(fontSize.value, theme)
      invariant(themeValue, `Theme value ${fontSize.value} not found`)

      return {
        type: ValueType.EXACT,
        value: {
          unit: Unit.REM,
          value: modulate({
            ratio: theme.core.ratio,
            size: theme.core.fontSize / 16,
            step: (themeValue as any).parameters.step,
          }),
        },
      }
    default:
      // @ts-expect-error
      throw new Error(`Invalid font size type ${fontSize.type}`)
  }
}
