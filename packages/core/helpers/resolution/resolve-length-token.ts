import { PixelValue, RemValue, Unit, ValueType } from "../../index"
import { modulateWithTheme } from "../../themes/helpers/modulate"
import {
  Theme,
  ThemeOption,
  isModulatedToken,
  isThemeExactToken,
} from "../../themes/types"

/** Converts an EXACT theme length token to a concrete PixelValue or RemValue. */
export function exactTokenToLength(parameters: {
  unit: Unit
  value: number
}): PixelValue | RemValue {
  return (
    parameters.unit === Unit.PX
      ? {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: parameters.value },
        }
      : {
          type: ValueType.EXACT,
          value: { unit: Unit.REM, value: parameters.value },
        }
  ) as PixelValue | RemValue
}

/**
 * Resolves a THEME_ORDINAL length token to a concrete length using the theme's
 * modulation scale. Returns undefined when the token is neither modulated nor exact.
 */
export function resolveModulatedOrExactLength(
  themeValue: ThemeOption,
  theme: Theme,
): PixelValue | RemValue | undefined {
  if (isModulatedToken(themeValue)) {
    const value = modulateWithTheme({
      theme,
      parameters: themeValue.parameters,
    })
    return { type: ValueType.EXACT, value: { unit: Unit.REM, value } }
  }
  if (isThemeExactToken(themeValue)) {
    return exactTokenToLength(themeValue.parameters)
  }
  return undefined
}
