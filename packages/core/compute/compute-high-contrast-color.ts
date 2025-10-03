import { convertAndApplyBrightness } from "../helpers/color/apply-brightness"
import { isDarkBackgroundColor } from "../helpers/color/contrast"
import { resolveColor } from "../helpers/resolution/resolve-color"
import { resolveValue } from "../helpers/resolution/resolve-value"
import { getThemeOption } from "../helpers/theme/get-theme-option"
import { ComputedFunction } from "../properties/constants/computed-functions"
import { ValueType } from "../properties/constants/value-types"
import { ColorValue } from "../properties/values/color/color"
import { ComputedValue } from "../properties/values/computed/computed-value"
import { ComputedHighContrastValue } from "../properties/values/computed/high-contrast-color"
import { BasedOnPropertyKey } from "../properties/values/shared/based-on-property-key"
import { EmptyValue } from "../properties/values/shared/empty"
import { PercentageValue } from "../properties/values/shared/percentage"
import { ThemeSwatch } from "../themes/types"
import { getBasedOnValue } from "./get-based-on-value"
import { ComputeContext } from "./types"

/**
 * Computes a high contrast color (white or black) based on a background color.
 * Applies brightness adjustments if the based-on node has a brightness property.
 *
 * @param value - The computed high contrast color value with basedOn reference
 * @param context - The computation context containing theme and parent data
 * @returns An exact color value (white or black) for high contrast
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

  return {
    type: ValueType.EXACT,
    value: themeOption.value,
  }
}

/**
 * Find a matching brightness property for the based-on node
 *
 * @param value - The computed value to find brightness for
 * @param context - The computation context
 * @returns The brightness percentage value if found, undefined otherwise
 */
function maybeGetBrightness(
  value: ComputedValue,
  context: ComputeContext,
): PercentageValue | undefined {
  try {
    const brightnessBasedOnValue: ComputedValue = {
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
  } catch (error) {
    return undefined
  }
}
