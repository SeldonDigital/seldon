import {
  DegreesValue,
  EmptyValue,
  GradientType,
  GradientTypeValue,
  PercentageValue,
} from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import type { GradientCompound } from "@seldon/core/properties/values/effects/gradients"
import { Theme } from "@seldon/core/themes/types"

import { getLayeredPaintColor } from "./get-layered-paint-color"

const DEFAULTS = {
  ANGLE: 0,
  TYPE: GradientType.LINEAR,
  START_POSITION: 0,
  START_OPACITY: 0,
  END_POSITION: 100,
  END_OPACITY: 0,
} as const

/**
 * Resolves a single gradient layer to a CSS gradient function string, or
 * undefined when the layer is missing its required start and end stop colors.
 * Facets fall back to the layer's theme preset and then to fixed defaults.
 */
export function resolveGradientLayer(
  gradient: GradientCompound,
  theme: Theme,
  useThemeVariableReferences?: boolean,
  themeSlug?: string,
): string | undefined {
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
    return undefined
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

  const startColorString = getLayeredPaintColor({
    color: resolvedStartColor,
    brightness: resolvedStartBrightness,
    opacity: resolvedStartOpacity,
    theme,
    useThemeVariableReferences,
    themeSlug,
  })

  const endColorString = getLayeredPaintColor({
    color: resolvedEndColor,
    brightness: resolvedEndBrightness,
    opacity: resolvedEndOpacity,
    theme,
    useThemeVariableReferences,
    themeSlug,
  })

  if (resolvedType === GradientType.LINEAR) {
    return `linear-gradient(${resolvedAngle}deg, ${startColorString} ${resolvedStartPosition}%, ${endColorString} ${resolvedEndPosition}%)`
  }

  if (resolvedType === GradientType.CONIC) {
    return `conic-gradient(from ${resolvedAngle}deg, ${startColorString} ${resolvedStartPosition}%, ${endColorString} ${resolvedEndPosition}%)`
  }

  return `radial-gradient(${startColorString} ${resolvedStartPosition}%, ${endColorString} ${resolvedEndPosition}%)`
}

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
