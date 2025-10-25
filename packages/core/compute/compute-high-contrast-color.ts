import { convertAndApplyBrightness } from "../helpers/color/apply-brightness"
import { isDarkBackgroundColor } from "../helpers/color/contrast"
import { resolveColor } from "../helpers/resolution/resolve-color"
import { resolveValue } from "../helpers/resolution/resolve-value"
import { getThemeOption } from "../helpers/theme/get-theme-option"
import { ValueType } from "../properties"
import { ColorValue } from "../properties/values/appearance/color"
import { BasedOnPropertyKey } from "../properties/values/shared/computed/based-on-property-key"
import { ComputedFunction } from "../properties/values/shared/computed/computed-functions"
import { ComputedValue } from "../properties/values/shared/computed/computed-value"
import { ComputedHighContrastValue } from "../properties/values/shared/computed/high-contrast-color"
import { EmptyValue } from "../properties/values/shared/empty/empty"
import { PercentageValue } from "../properties/values/shared/exact/percentage"
import { ThemeSwatch } from "../themes/types"
import { getBasedOnValue } from "./get-based-on-value"
import { ComputeContext } from "./types"

/**
 * Display name for this computed function (used by editor UI)
 */
export const HIGH_CONTRAST_COLOR_DISPLAY_NAME = "High Contrast"

/**
 * Computes a high contrast color (white or black) based on a background color.
 * Applies brightness adjustments if the based-on node has a brightness property.
 * Handles missing parameters with sensible defaults.
 *
 * @param value - The computed high contrast color value with basedOn reference
 * @param context - The computation context containing theme and parent data
 * @returns An exact color value (white or black) for high contrast
 */
export function computeHighContrastColor(
  value: ComputedHighContrastValue,
  context: ComputeContext,
) {
  // Use default if basedOn not provided
  const basedOn = value.value.input.basedOn || "#parent.background.color"

  // Create value with defaults applied
  const valueWithDefaults = {
    ...value,
    value: {
      ...value.value,
      input: { basedOn },
    },
  }

  const basedOnValue = getBasedOnValue(valueWithDefaults, context)

  const brightness = maybeGetBrightness(valueWithDefaults, context)

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
