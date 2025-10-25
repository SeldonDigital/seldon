import { ComputeContext } from "../../compute/types"
import {
  EmptyValue,
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

      return {
        type: ValueType.EXACT,
        value: {
          unit: Unit.REM,
          value: modulateWithTheme({
            theme,
            parameters: (themeValue as any).parameters,
          }),
        },
      }
    }
    default:
      throw new Error(
        `Invalid spread type ${(spread as { type: string }).type}`,
      )
  }
}
