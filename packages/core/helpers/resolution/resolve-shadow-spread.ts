import {
  PixelValue,
  RemValue,
  ShadowSpreadValue,
  Unit,
  ValueType,
} from "../../index"
import { Theme } from "../../themes/types"
import { modulateWithTheme } from "../math/modulate"
import { getThemeOption } from "../theme/get-theme-option"

/**
 * Resolves shadow spread values to concrete PixelValue or RemValue
 *
 * @param spread - The shadow spread value to resolve
 * @param theme - The theme object containing shadow spread tokens
 * @returns The resolved shadow spread value
 */
export function resolveShadowSpread({
  spread,
  theme,
}: {
  spread: ShadowSpreadValue
  theme: Theme
}): PixelValue | RemValue {
  switch (spread.type) {
    case ValueType.EXACT:
      return spread

    case ValueType.THEME_ORDINAL: {
      const themeValue = getThemeOption(spread.value, theme)

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
      throw new Error(`Invalid spread type ${spread.type}`)
  }
}
