import {
  EmptyValue,
  PixelValue,
  RemValue,
  ShadowSpreadValue,
  ValueType,
} from "../../index"
import type { ComputeContext } from "../../properties/compute/types"
import { Theme } from "../../themes/types"
import { getThemeOption } from "../theme/get-theme-option"
import { resolveModulatedOrExactLength } from "./resolve-length-token"

/**
 * Resolves shadow spread values to concrete PixelValue or RemValue.
 * Handles EMPTY, EXACT, and THEME_ORDINAL value types.
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
  parentContext?: ComputeContext | null
}): PixelValue | RemValue | EmptyValue {
  switch (spread.type) {
    case ValueType.EMPTY:
      return spread as EmptyValue
    case ValueType.EXACT:
      return spread as PixelValue | RemValue
    case ValueType.THEME_ORDINAL: {
      const themeValue = getThemeOption(spread.value as string, theme)
      const resolved = resolveModulatedOrExactLength(themeValue, theme)
      if (resolved) return resolved
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
