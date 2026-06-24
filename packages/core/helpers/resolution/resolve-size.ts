import {
  EmptyValue,
  PixelValue,
  RemValue,
  SizeValue,
  Unit,
  ValueType,
} from "../../index"
import { resolveAutoFitSource } from "../../properties/compute/resolve-auto-fit-source"
import type { ComputeContext } from "../../properties/compute/types"
import { Theme } from "../../themes/types"
import { isModulatedToken, isThemeExactToken } from "../../themes/types"
import { modulate } from "../math/modulate"
import { getThemeOption } from "../theme/get-theme-option"
import { exactTokenToLength } from "./resolve-length-token"

/**
 * Resolves size values to concrete PixelValue, RemValue, or EmptyValue.
 * Handles EMPTY, EXACT, COMPUTED, and THEME_ORDINAL value types.
 *
 * @param size - The size value to resolve
 * @param parentContext - The parent context for computed value resolution
 * @param theme - The theme object containing size tokens
 * @returns The resolved size value
 */
export function resolveSize({
  size,
  parentContext,
  theme,
}: {
  size: SizeValue | EmptyValue
  parentContext: ComputeContext | null
  theme: Theme
}): PixelValue | RemValue | EmptyValue {
  switch (size.type) {
    case ValueType.EMPTY:
    case ValueType.EXACT:
      return size as PixelValue | RemValue | EmptyValue
    case ValueType.COMPUTED: {
      if (!parentContext) {
        throw new Error(
          `resolveSize received a COMPUTED value. This should have been computed in the compute function.`,
        )
      }

      const source = resolveAutoFitSource({
        properties: {},
        parentContext,
        theme,
      })

      const resolvedSource = resolveSize({
        size: source as SizeValue,
        parentContext,
        theme,
      })

      if (resolvedSource.type === ValueType.EMPTY) {
        throw new Error(`Auto fit source is empty`)
      }

      return {
        type: ValueType.EXACT,
        value: {
          unit: Unit.REM,
          value: resolvedSource.value.value * theme.autoFit.parameters.factor,
        },
      }
    }

    case ValueType.THEME_ORDINAL: {
      const themeValue = getThemeOption(size.value as string, theme)
      if (isModulatedToken(themeValue)) {
        const n = modulate({
          ratio: theme.modulation.parameters.ratio,
          size: theme.modulation.parameters.baseSize,
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
        `Theme key ${size.value as string} must resolve to MODULATED or EXACT length`,
      )
    }

    default:
      throw new Error(`Invalid size type ${(size as { type: string }).type}`)
  }
}
