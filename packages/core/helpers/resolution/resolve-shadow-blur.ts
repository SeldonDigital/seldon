import {
  EmptyValue,
  PixelValue,
  RemValue,
  ShadowBlurValue,
  ValueType,
} from "../../index"
import type { ComputeContext } from "../../properties/compute/types"
import { Theme } from "../../themes/types"
import { getThemeOption } from "../theme/get-theme-option"
import { resolveModulatedOrExactLength } from "./resolve-length-token"

/**
 * Resolves shadow blur values to concrete PixelValue or RemValue.
 * Handles EMPTY, EXACT, and THEME_ORDINAL value types.
 *
 * @param blur - The shadow blur value to resolve
 * @param theme - The theme object containing shadow blur tokens
 * @returns The resolved shadow blur value
 */
export function resolveShadowBlur({
  blur,
  theme,
  parentContext,
}: {
  blur: ShadowBlurValue
  theme: Theme
  parentContext?: ComputeContext | null
}): PixelValue | RemValue | EmptyValue {
  switch (blur.type) {
    case ValueType.EMPTY:
      return blur as EmptyValue
    case ValueType.EXACT:
      return blur as PixelValue | RemValue
    case ValueType.THEME_ORDINAL: {
      const themeValue = getThemeOption(blur.value as string, theme)
      const resolved = resolveModulatedOrExactLength(themeValue, theme)
      if (resolved) return resolved
      throw new Error(
        `Theme value ${blur.value as string} must resolve to MODULATED or EXACT length`,
      )
    }
    default:
      throw new Error(`Invalid blur type ${(blur as { type: string }).type}`)
  }
}
