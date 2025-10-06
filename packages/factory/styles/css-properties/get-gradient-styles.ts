import {
  DegreesValue,
  EmptyValue,
  GradientType,
  GradientTypeValue,
  PercentageValue,
} from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { StyleGenerationContext } from "../types"
import { getColorCSSValue } from "./get-color-css-value"
import { CSSObject } from "./types"

const DEFAULTS = {
  ANGLE: 0,
  TYPE: GradientType.LINEAR,
  START_POSITION: 0,
  START_OPACITY: 0,
  END_POSITION: 100,
  END_OPACITY: 0,
} as const

export function getGradientStyles({
  properties,
  theme,
}: StyleGenerationContext): CSSObject {
  const { gradient } = properties

  if (!gradient) return {}

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
  } = gradient

  const preset = resolveValue(gradient.preset)
  const themeGradient = preset ? getThemeOption(preset.value, theme) : undefined

  const resolvedStartColor =
    resolveValue(startColor) ??
    resolveValue(themeGradient?.parameters.startColor)
  const resolvedEndColor =
    resolveValue(endColor) ?? resolveValue(themeGradient?.parameters.endColor)

  // Start and end colors are required for the gradient. These do not have defaults.
  if (!startColor || !endColor || !resolvedStartColor || !resolvedEndColor) {
    return {}
  }

  const resolvedType = resolvePreset(
    gradientType,
    themeGradient?.parameters.gradientType,
    DEFAULTS.TYPE,
  )

  const resolvedAngle = resolveAngle(
    angle,
    themeGradient?.parameters.angle,
    DEFAULTS.ANGLE,
  )

  const resolvedStartOpacity = resolveOpacity(
    startOpacity,
    themeGradient?.parameters.startOpacity,
    DEFAULTS.START_OPACITY,
  )

  const resolvedEndOpacity = resolveOpacity(
    endOpacity,
    themeGradient?.parameters.endOpacity,
    DEFAULTS.END_OPACITY,
  )

  const resolvedStartBrightness =
    resolveValue(startBrightness) ||
    resolveValue(themeGradient?.parameters.startBrightness)

  const resolvedEndBrightness =
    resolveValue(endBrightness) ||
    resolveValue(themeGradient?.parameters.endBrightness)

  const resolvedStartPosition = resolvePosition(
    startPosition,
    themeGradient?.parameters.startPosition,
    DEFAULTS.START_POSITION,
  )

  const resolvedEndPosition = resolvePosition(
    endPosition,
    themeGradient?.parameters.endPosition,
    DEFAULTS.END_POSITION,
  )

  const startColorString = getColorCSSValue({
    color: resolvedStartColor,
    brightness: resolvedStartBrightness,
    opacity: resolvedStartOpacity,
    theme,
  })

  const endColorString = getColorCSSValue({
    color: resolvedEndColor,
    brightness: resolvedEndBrightness,
    opacity: resolvedEndOpacity,
    theme,
  })

  const styles: CSSObject = {
    backgroundImage:
      resolvedType === GradientType.LINEAR
        ? `linear-gradient(${resolvedAngle}deg, ${startColorString} ${resolvedStartPosition}%, ${endColorString} ${resolvedEndPosition}%)`
        : `radial-gradient(${startColorString} ${resolvedStartPosition}%, ${endColorString} ${resolvedEndPosition}%)`,
  }

  if (properties.content) {
    styles.color = "transparent"
    styles.backgroundClip = "text"
  }

  return styles
}

// These resolve functions check if the gradient subvalue is defined on properties.gradient, if not check the preset in the theme.
// If still not defined, return the default value.
function resolveOpacity(
  propertiesValue: PercentageValue | EmptyValue | undefined,
  themeValue: PercentageValue | EmptyValue | undefined,
  defaultValue: number,
): number {
  return (
    resolveValue(propertiesValue)?.value.value ??
    resolveValue(themeValue)?.value.value ??
    defaultValue
  )
}

function resolvePosition(
  propertiesValue: PercentageValue | EmptyValue | undefined,
  themeValue: PercentageValue | EmptyValue | undefined,
  defaultValue: number,
): number {
  return (
    resolveValue(propertiesValue)?.value.value ??
    resolveValue(themeValue)?.value.value ??
    defaultValue
  )
}

function resolveAngle(
  propertiesValue: DegreesValue | EmptyValue | undefined,
  themeValue: DegreesValue | EmptyValue | undefined,
  defaultValue: number,
): number {
  return (
    resolveValue(propertiesValue)?.value.value ??
    resolveValue(themeValue)?.value.value ??
    defaultValue
  )
}

function resolvePreset(
  propertiesValue: GradientTypeValue | EmptyValue | undefined,
  themeValue: GradientTypeValue | EmptyValue | undefined,
  defaultValue: GradientType,
): GradientType {
  return (
    resolveValue(propertiesValue)?.value ??
    resolveValue(themeValue)?.value ??
    defaultValue
  )
}
