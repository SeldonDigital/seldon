import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import type { ShadowCompound } from "@seldon/core/properties/values/effects/shadow"
import { ShadowType } from "@seldon/core/properties/values/effects/shadow"
import { Theme } from "@seldon/core/themes/types"

import { StyleGenerationContext } from "../types"
import { getCssValue } from "./get-css-value"
import { getLayeredPaintColor } from "./get-layered-paint-color"
import { getLayeredPaintLayers } from "./get-layered-paint-layer"
import { getShadowBlurCSSValue } from "./get-shadow-blur-css-value"
import { getShadowSpreadCSSValue } from "./get-shadow-spread-css-value"
import { CSSObject } from "./types"

export function getShadowStyles({
  properties,
  theme,
  useThemeVariableReferences,
  themeSlug,
}: StyleGenerationContext): CSSObject {
  const layers = getLayeredPaintLayers(properties, "shadow")
  const isText = !!properties.content

  const shadows = layers
    .map((layer) =>
      resolveShadowLayer(
        layer,
        theme,
        isText,
        useThemeVariableReferences,
        themeSlug,
      ),
    )
    .filter((shadow): shadow is string => shadow !== undefined)

  if (shadows.length === 0) return {}

  // Index 0 is the bottom layer. CSS paints the first shadow in the list on top,
  // so emit the highest index first and index 0 last to keep index 0 at the back.
  const joined = shadows.reverse().join(", ")
  return isText ? { textShadow: joined } : { boxShadow: joined }
}

/**
 * Resolves a single shadow layer to a CSS shadow string, or undefined when the
 * layer is missing required offsets, color, or blur. Text shadows omit spread.
 */
function resolveShadowLayer(
  shadow: ShadowCompound,
  theme: Theme,
  isText: boolean,
  useThemeVariableReferences?: boolean,
  themeSlug?: string,
): string | undefined {
  const preset = resolveValue(shadow.preset)
  const themeShadow = preset ? getThemeOption(preset.value, theme) : undefined

  const { offsetX, offsetY, opacity, blur, spread, brightness, color } = shadow

  // Inset placement only applies to box shadows; text shadows have no inset.
  const resolvedType = resolveValue(shadow.type)
  const insetPrefix =
    !isText && resolvedType?.value === ShadowType.INNER ? "inset " : ""

  const resolvedOffsetX =
    resolveValue(offsetX) || resolveValue(themeShadow?.parameters.offsetX)
  const resolvedOffsetY =
    resolveValue(offsetY) || resolveValue(themeShadow?.parameters.offsetY)
  const resolvedOpacity =
    resolveValue(opacity) || resolveValue(themeShadow?.parameters.opacity)
  const resolvedBlur =
    resolveValue(blur) || resolveValue(themeShadow?.parameters.blur)
  const resolvedSpread =
    resolveValue(spread) || resolveValue(themeShadow?.parameters.spread)
  const resolvedBrightness =
    resolveValue(brightness) || resolveValue(themeShadow?.parameters.brightness)
  const resolvedColor =
    resolveValue(color) || resolveValue(themeShadow?.parameters.color)

  const hasNecessaryPropertiesInSchema = offsetX && offsetY && color && blur
  const hasResolvedNecessaryValues =
    resolvedOffsetX && resolvedOffsetY && resolvedColor && resolvedBlur

  if (!hasNecessaryPropertiesInSchema || !hasResolvedNecessaryValues) {
    return undefined
  }

  const offsetXString = getCssValue(resolvedOffsetX)
  const offsetYString = getCssValue(resolvedOffsetY)
  const blurString = getShadowBlurCSSValue({ blur: resolvedBlur, theme })
  const colorString = getLayeredPaintColor({
    color: resolvedColor,
    opacity: resolvedOpacity,
    brightness: resolvedBrightness,
    theme,
    useThemeVariableReferences,
    themeSlug,
  })

  // Text shadows do not support a spread value.
  if (isText || !spread || !resolvedSpread) {
    return `${insetPrefix}${offsetXString} ${offsetYString} ${blurString} ${colorString}`
  }

  const spreadString = getShadowSpreadCSSValue({
    spread: resolvedSpread,
    theme,
  })
  return `${insetPrefix}${offsetXString} ${offsetYString} ${blurString} ${spreadString} ${colorString}`
}
