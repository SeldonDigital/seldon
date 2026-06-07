import {
  BorderWidth,
  BorderWidthHairlineValue,
  BorderWidthValue,
  EmptyValue,
  PixelValue,
  RemValue,
  ValueType,
} from "../../index"
import type { ComputeContext } from "../../properties/compute/types"
import { Theme } from "../../themes/types"
import { isOptionToken } from "../../themes/types"
import { getThemeOption } from "../theme/get-theme-option"
import { resolveModulatedOrExactLength } from "./resolve-length-token"

/**
 * Resolves border width values to concrete PixelValue, RemValue, BorderWidthHairlineValue, or EmptyValue.
 * Handles EMPTY, EXACT, OPTION, and THEME_ORDINAL value types.
 *
 * @param borderWidth - The border width value to resolve
 * @param theme - The theme object containing border width tokens
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
    case ValueType.OPTION:
      return borderWidth
    case ValueType.THEME_ORDINAL: {
      const themeValue = getThemeOption(borderWidth.value as string, theme)

      if (isOptionToken(themeValue) && themeValue.parameters === "hairline") {
        return {
          type: ValueType.OPTION,
          value: BorderWidth.HAIRLINE,
        }
      }

      const resolved = resolveModulatedOrExactLength(themeValue, theme)
      if (resolved) return resolved
      throw new Error(
        `Theme value ${borderWidth.value as string} must resolve to MODULATED or EXACT length`,
      )
    }
    default:
      throw new Error(
        `Invalid border width type ${(borderWidth as { type: string }).type}`,
      )
  }
}
