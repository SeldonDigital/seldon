import { convertAndApplyBrightness } from "../../helpers/color/apply-brightness"
import { isDarkBackgroundColor } from "../../helpers/color/contrast"
import { themeSwatchToColorValue } from "../../helpers/color/theme-swatch-to-color-value"
import { resolveColor } from "../../helpers/resolution/resolve-color"
import { resolveValue } from "../../helpers/resolution/resolve-value"
import { getThemeOption } from "../../helpers/theme/get-theme-option"
import type { ThemeSwatch } from "../../themes/types"
import { ComputedFunction, ValueType } from "../constants"
import type { ColorValue } from "../values/appearance/color"
import type { BasedOnPropertyKey } from "../values/shared/computed/based-on-property-key"
import type { ComputedHighContrastValue } from "../values/shared/computed/high-contrast-color"
import type { EmptyValue } from "../values/shared/empty/empty"
import type { PercentageValue } from "../values/shared/exact/percentage"
import { getBasedOnValue } from "./get-based-on-value"
import { ComputeContext } from "./types"

/** Editor label for `ComputedFunction.HIGH_CONTRAST_COLOR`. */
export const HIGH_CONTRAST_COLOR_DISPLAY_NAME = "High Contrast"

/**
 * Reads the color at `basedOn`, optionally reads a sibling `.brightness` when `basedOn` ends with
 * `.color`, resolves through the theme, then returns the theme’s white or black swatch so text reads
 * on that background. `basedOn` is required on the stored value (typically `#parent.background.color`
 * for foreground-on-surface).
 *
 * @param value - Stored computed high-contrast value
 * @param context - Theme and contexts for resolution
 * @returns `EXACT` string taken from `@swatch.white` or `@swatch.black` on the theme
 */
export function computeHighContrastColor(
  value: ComputedHighContrastValue,
  context: ComputeContext,
) {
  const basedOnValue = getBasedOnValue(value, context)

  const brightness = maybeGetBrightness(value, context)

  let color = resolveValue(
    resolveColor({
      color: basedOnValue as ColorValue,
      theme: context.theme,
    }),
  )

  if (brightness && color?.type === ValueType.EXACT) {
    const withBrightnessApplied = convertAndApplyBrightness(
      color.value,
      brightness.value.value,
    )

    color = {
      type: ValueType.EXACT,
      value: withBrightnessApplied,
    }
  }

  const isDark = color ? isDarkBackgroundColor(color) : false

  const themeOption = getThemeOption(
    isDark ? "@swatch.white" : "@swatch.black",
    context.theme,
  ) as ThemeSwatch

  return themeSwatchToColorValue(themeOption)
}

/**
 * Builds a temporary `basedOn` by swapping the trailing `.color` segment to `.brightness`, resolves
 * it, and returns the percentage when present. Returns undefined when the path is missing or not
 * resolvable.
 */
function maybeGetBrightness(
  value: ComputedHighContrastValue,
  context: ComputeContext,
): PercentageValue | undefined {
  try {
    const brightnessBasedOnValue: ComputedHighContrastValue = {
      ...value,
      value: {
        function: ComputedFunction.HIGH_CONTRAST_COLOR,
        input: {
          basedOn: value.value.input.basedOn.replace(
            ".color",
            ".brightness",
          ) as BasedOnPropertyKey,
        },
      },
    }

    const brightnessValue = getBasedOnValue(brightnessBasedOnValue, context) as
      | PercentageValue
      | EmptyValue

    return resolveValue(brightnessValue)
  } catch {
    return undefined
  }
}
