import {
  EmptyValue,
  PixelValue,
  RemValue,
  ShadowSpreadValue,
  Unit,
  ValueType,
} from "../../index"
import type { ComputeContext } from "../../properties/compute/types"
import { modulateWithTheme } from "../../themes/helpers/modulate"
import { Theme } from "../../themes/types"
import { isModulatedToken, isThemeExactToken } from "../../themes/types"
import { getThemeOption } from "../theme/get-theme-option"

/**
 * Resolves shadow spread values to concrete PixelValue or RemValue.
 * Handles EMPTY, EXACT, and THEME_ORDINAL value types.
 *
 * @param spread - The shadow spread value to resolve
 * @param theme - The theme object containing shadow spread tokens
 * @param parentContext - The parent context for computed value resolution
 * @returns The resolved shadow spread value
 */
export function resolveShadowSpread({
  spread,
  theme,
  parentContext,
}: {
  spread: ShadowSpreadValue
  theme: Theme
  parentContext?: ComputeContext | null
}): PixelValue | RemValue | EmptyValue {
  switch (spread.type) {
    case ValueType.EMPTY:
      return spread as EmptyValue
    case ValueType.EXACT:
      return spread as PixelValue | RemValue
    case ValueType.THEME_ORDINAL: {
      const themeValue = getThemeOption(spread.value as string, theme)
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
        `Theme value ${spread.value as string} must resolve to MODULATED or EXACT length`,
      )
    }
    default:
      throw new Error(
        `Invalid spread type ${(spread as { type: string }).type}`,
      )
  }
}
