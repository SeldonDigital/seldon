import {
  DegreesValue,
  EmptyValue,
  GradientPositionValue,
  GradientRepeatValue,
  GradientShape,
  GradientShapeValue,
  GradientSize,
  GradientSizeValue,
  GradientType,
  PercentageValue,
} from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { getAnchoredFacetDefault } from "@seldon/core/properties/helpers/anchored-facet-default"
import { BackgroundKind } from "@seldon/core/properties/values/appearance/background/background-kind"
import type { GradientCompound } from "@seldon/core/properties/values/effects/gradients"
import { Theme } from "@seldon/core/themes/types"

import { getLayeredPaintColor } from "./get-layered-paint-color"

// An unset gradient-stop opacity renders fully opaque, matching the shared
// anchored facet default the color layers and override-pruning already use.
// Sourcing it here keeps the render default and the prune baseline from drifting
// apart, which would otherwise silently drop a stop written to its default.
const OPACITY_DEFAULT = getAnchoredFacetDefault("opacity")?.value.value ?? 100

const DEFAULTS = {
  ANGLE: 0,
  START_POSITION: 0,
  START_OPACITY: OPACITY_DEFAULT,
  END_POSITION: 100,
  END_OPACITY: OPACITY_DEFAULT,
  POSITION: "50%",
  SHAPE: GradientShape.ELLIPSE,
  SIZE: GradientSize.FARTHEST_CORNER,
} as const

/** Maps a background gradient kind to the CSS gradient family it paints. */
const KIND_TO_TYPE: Partial<Record<BackgroundKind, GradientType>> = {
  [BackgroundKind.LINEAR_GRADIENT]: GradientType.LINEAR,
  [BackgroundKind.RADIAL_GRADIENT]: GradientType.RADIAL,
  [BackgroundKind.CONIC_GRADIENT]: GradientType.CONIC,
}

/**
 * Resolves a single gradient layer to a CSS gradient function string, or
 * undefined when the layer is missing its required start and end stop colors.
 * The layer `kind` selects the gradient family; remaining facets fall back to
 * the layer's theme preset and then to fixed defaults.
 */
export function resolveGradientLayer(
  gradient: GradientCompound,
  kind: BackgroundKind,
  theme: Theme,
  useThemeVariableReferences?: boolean,
): string | undefined {
  const {
    angle,
    positionX,
    positionY,
    shape,
    radialSize,
    conicRepeat,
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

  // Start and end colors are required for the gradient. They may come from the
  // layer's own facets or from its theme preset, so gate on the resolved values
  // rather than the raw facets, letting a preset-driven gradient render even
  // when its stop facets are unset.
  if (!resolvedStartColor || !resolvedEndColor) {
    return undefined
  }

  const resolvedType = KIND_TO_TYPE[kind] ?? GradientType.LINEAR

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
  })

  const endColorString = getLayeredPaintColor({
    color: resolvedEndColor,
    brightness: resolvedEndBrightness,
    opacity: resolvedEndOpacity,
    theme,
    useThemeVariableReferences,
  })

  const stops = `${startColorString} ${resolvedStartPosition}%, ${endColorString} ${resolvedEndPosition}%`

  if (resolvedType === GradientType.RADIAL) {
    const resolvedShape = resolveOption(
      shape,
      themeGradient?.parameters.shape,
      DEFAULTS.SHAPE,
    )
    const resolvedSize = resolveOption(
      radialSize,
      themeGradient?.parameters.radialSize,
      DEFAULTS.SIZE,
    )
    const x = resolveLength(
      positionX,
      themeGradient?.parameters.positionX,
      DEFAULTS.POSITION,
    )
    const y = resolveLength(
      positionY,
      themeGradient?.parameters.positionY,
      DEFAULTS.POSITION,
    )
    return `radial-gradient(${resolvedShape} ${resolvedSize} at ${x} ${y}, ${stops})`
  }

  if (resolvedType === GradientType.CONIC) {
    const repeats = resolveBoolean(
      conicRepeat,
      themeGradient?.parameters.conicRepeat,
    )
    const fn = repeats ? "repeating-conic-gradient" : "conic-gradient"
    return `${fn}(from ${resolvedAngle}deg, ${stops})`
  }

  return `linear-gradient(${resolvedAngle}deg, ${stops})`
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

/**
 * Resolves a radial center axis to a CSS position: a named anchor keyword such
 * as `left` or `top` passes through, a measured value keeps its px/rem/% unit.
 */
function resolveLength(
  propertiesValue: GradientPositionValue | EmptyValue | undefined,
  themeValue: GradientPositionValue | EmptyValue | undefined,
  defaultValue: string,
): string {
  const resolved =
    resolveValue(propertiesValue)?.value ?? resolveValue(themeValue)?.value
  if (typeof resolved === "string") return resolved
  if (resolved && typeof resolved === "object") {
    const measure = resolved as { value?: unknown; unit?: unknown }
    if (typeof measure.value === "number" && typeof measure.unit === "string") {
      return `${measure.value}${measure.unit}`
    }
  }
  return defaultValue
}

/** Resolves a radial shape or size facet, falling back through preset then default. */
function resolveOption<T extends string>(
  propertiesValue: GradientShapeValue | GradientSizeValue | undefined,
  themeValue: GradientShapeValue | GradientSizeValue | undefined,
  defaultValue: T,
): T {
  const resolved =
    resolveValue(propertiesValue)?.value ?? resolveValue(themeValue)?.value
  return typeof resolved === "string" ? (resolved as T) : defaultValue
}

/** Resolves a boolean facet, falling back through preset then to false. */
function resolveBoolean(
  propertiesValue: GradientRepeatValue | undefined,
  themeValue: GradientRepeatValue | undefined,
): boolean {
  const resolved =
    resolveValue(propertiesValue)?.value ?? resolveValue(themeValue)?.value
  return resolved === true
}
