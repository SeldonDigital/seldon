import type { ComputeContext } from "../../properties/compute/types"
import type { ColorValue } from "../../properties/values/appearance/color"
import type { EmptyValue } from "../../properties/values/shared/empty/empty"
import type { HexValue } from "../../properties/values/shared/exact/hex"
import type { HSLValue } from "../../properties/values/shared/exact/hsl"
import type { LCHValue } from "../../properties/values/shared/exact/lch"
import type { RGBValue } from "../../properties/values/shared/exact/rgb"
import type { TransparentValue } from "../../properties/values/shared/option/transparent"
import { ValueType } from "../../properties/constants/shared/value-types"
import { invariant } from "../utils/invariant"
import { Theme } from "../../themes/types"
import { debugLog } from "../../utils/debug-logger"
import { themeSwatchToColorValue } from "../color/theme-swatch-to-color-value"
import { getThemeOption } from "../theme/get-theme-option"
import { isSwatchToken } from "../../themes/values"

/**
 * Resolves color values to concrete HSLValue, RGBValue, HexValue, LCHValue, TransparentValue, or EmptyValue.
 * Handles EMPTY, EXACT, OPTION, and THEME_CATEGORICAL value types.
 *
 * @param color - The color value to resolve
 * @param theme - The theme object containing color tokens
 * @param parentContext - The parent context for computed value resolution
 * @returns The resolved color value
 */
export function resolveColor({
  color,
  theme,
  parentContext,
}: {
  color: ColorValue | EmptyValue
  theme: Theme
  parentContext?: ComputeContext | null
}): HSLValue | RGBValue | HexValue | LCHValue | TransparentValue | EmptyValue {
  // Validate that the color has a valid type
  if (!color || typeof color !== "object" || !color.type) {
    debugLog(
      "Workspace",
      "resolveColor",
      "Invalid color object, falling back to empty value",
      {
        color: JSON.stringify(color),
      },
    )
    return { type: ValueType.EMPTY, value: null }
  }

  switch (color.type) {
    case ValueType.EMPTY:
    case ValueType.EXACT:
    case ValueType.OPTION:
      return color
    case ValueType.COMPUTED:
      throw new Error(
        `resolveColor received a COMPUTED value. This should have been computed in the compute function.`,
      )
    case ValueType.THEME_CATEGORICAL: {
      const themeValue = getThemeOption(color.value as string, theme)
      invariant(themeValue, `Theme value ${color.value} not found`)
      if (!isSwatchToken(themeValue)) {
        debugLog(
          "Workspace",
          "resolveColor",
          "Theme categorical color must reference a swatch token",
          { key: color.value },
        )
        return { type: ValueType.EMPTY, value: null }
      }
      return themeSwatchToColorValue(themeValue)
    }
    default:
      debugLog(
        "Workspace",
        "resolveColor",
        "Invalid color type, falling back to empty value",
        {
          colorType: (color as any).type,
        },
      )
      return { type: ValueType.EMPTY, value: null }
  }
}
