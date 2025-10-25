import {
  GradientAngleValue,
  GradientStopOpacityValue,
  GradientStopPositionValue,
  GradientTypeValue,
  Properties,
  Theme,
  ThemeGradient,
  ThemeSwatch,
} from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { isValidColorValue } from "@seldon/core/helpers/type-guards/color/is-valid-color-value"
import { isThemeValueKey } from "@seldon/core/helpers/validation"
import { GradientStopBrightnessValue } from "@seldon/core/properties/values/gradients/gradient-stop-brightness"

interface ResolvedGradient {
  type?: GradientTypeValue
  angle?: GradientAngleValue
  startColor?: ThemeSwatch
  startOpacity?: GradientStopOpacityValue
  startBrightness?: GradientStopBrightnessValue
  startPosition?: GradientStopPositionValue
  endColor?: ThemeSwatch
  endOpacity?: GradientStopOpacityValue
  endBrightness?: GradientStopBrightnessValue
  endPosition?: GradientStopPositionValue
}

export function resolveGradient(
  properties: Properties,
  theme: Theme,
): ResolvedGradient | undefined {
  const preset = resolveValue(properties.gradient?.preset)

  if (!preset) return

  const themeGradientOption = getThemeOption(
    preset.value,
    theme,
  ) as ThemeGradient

  const {
    gradientType,
    angle,
    startColor,
    startOpacity,
    startBrightness,
    startPosition,
    endColor,
    endOpacity,
    endBrightness,
    endPosition,
  } = themeGradientOption.parameters
  let startColorValue: ThemeSwatch | undefined
  let endColorValue: ThemeSwatch | undefined
  if (startColor && isValidColorValue(startColor)) {
    if (isThemeValueKey(startColor.value)) {
      startColorValue = getThemeOption(startColor.value, theme)
    }
  }

  if (endColor && isValidColorValue(endColor)) {
    if (isThemeValueKey(endColor.value)) {
      endColorValue = getThemeOption(endColor.value, theme)
    }
  }

  const result: ResolvedGradient = {}

  result.type = resolveValue(gradientType)
  result.angle = resolveValue(angle)
  result.startColor = startColorValue
  result.startOpacity = resolveValue(startOpacity)
  result.startBrightness = resolveValue(startBrightness)
  result.startPosition = resolveValue(startPosition)
  result.endColor = endColorValue
  result.endOpacity = resolveValue(endOpacity)
  result.endBrightness = resolveValue(endBrightness)
  result.endPosition = resolveValue(endPosition)

  return result
}
