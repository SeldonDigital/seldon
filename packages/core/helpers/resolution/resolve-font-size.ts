import {
  EmptyValue,
  FontSizeValue,
  PixelValue,
  RemValue,
  Unit,
  ValueType,
  invariant,
} from "../../index"
import type { ComputeContext } from "../../properties/compute/types"
import { Theme } from "../../themes/types"
import { isModulatedToken, isThemeExactToken } from "../../themes/types"
import { modulate } from "../math/modulate"
import { getThemeOption } from "../theme/get-theme-option"
import { exactTokenToLength } from "./resolve-length-token"

/**
 * Resolves font size values to concrete PixelValue, RemValue, or EmptyValue.
 * Handles EMPTY, EXACT, and THEME_ORDINAL value types.
 *
 * @param fontSize - The font size value to resolve
 * @param theme - The theme object containing font size tokens
 * @returns The resolved font size value
 */
export function resolveFontSize({
  fontSize,
  theme,
  parentContext,
}: {
  fontSize: FontSizeValue | EmptyValue
  theme: Theme
  parentContext?: ComputeContext | null
}): PixelValue | RemValue | EmptyValue {
  // Handle computed values first to narrow the type
  if (fontSize.type === ValueType.COMPUTED) {
    throw new Error(
      `resolveFontSize received a COMPUTED value. This should have been computed in the compute function.`,
    )
  }

  switch (fontSize.type) {
    case ValueType.EMPTY:
      return fontSize as EmptyValue
    case ValueType.EXACT:
      return fontSize as PixelValue | RemValue
    case ValueType.THEME_ORDINAL: {
      const themeValue = getThemeOption(fontSize.value as string, theme)
      invariant(themeValue, `Theme value ${fontSize.value} not found`)
      if (isModulatedToken(themeValue)) {
        const n = modulate({
          ratio: theme.core.ratio,
          size: theme.core.fontSize / 16,
          step: themeValue.parameters.step,
        })
        return {
          type: ValueType.EXACT,
          value: { unit: Unit.REM, value: n },
        }
      }
      if (isThemeExactToken(themeValue)) {
        return exactTokenToLength(themeValue.parameters)
      }
      throw new Error(
        `Theme value ${fontSize.value as string} must resolve to MODULATED or EXACT length`,
      )
    }
    default:
      throw new Error(`Invalid font size type ${(fontSize as any).type}`)
  }
}
