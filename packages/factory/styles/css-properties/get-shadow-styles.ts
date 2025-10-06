import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { StyleGenerationContext } from "../types"
import { getColorCSSValue } from "./get-color-css-value"
import { getCssValue } from "./get-css-value"
import { getShadowBlurCSSValue } from "./get-shadow-blur-css-value"
import { getShadowSpreadCSSValue } from "./get-shadow-spread-css-value"
import { CSSObject } from "./types"

export function getShadowStyles({
  properties,
  theme,
}: StyleGenerationContext): CSSObject {
  const preset = resolveValue(properties.shadow?.preset)
  const themeShadow = preset ? getThemeOption(preset.value, theme) : undefined
  const { shadow } = properties

  if (!shadow) {
    return {}
  }

  const { offsetX, offsetY, opacity, blur, spread, brightness, color } = shadow

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
    return {}
  }

  const offsetXString = getCssValue(resolvedOffsetX)
  const offsetYString = getCssValue(resolvedOffsetY)
  const blurString = getShadowBlurCSSValue({ blur: resolvedBlur, theme })
  const colorString = getColorCSSValue({
    color: resolvedColor,
    opacity: resolvedOpacity,
    brightness: resolvedBrightness,
    theme,
  })

  if (properties.content) {
    return {
      // Text shadows don't have a spread value
      textShadow: `${offsetXString} ${offsetYString} ${blurString} ${colorString}`,
    }
  }

  // Box shadows can also have an optional spread value
  if (!spread || !resolvedSpread)
    return {
      boxShadow: `${offsetXString} ${offsetYString} ${blurString} ${colorString}`,
    }

  const spreadString = getShadowSpreadCSSValue({
    spread: resolvedSpread,
    theme,
  })

  return {
    boxShadow: `${offsetXString} ${offsetYString} ${blurString} ${spreadString} ${colorString}`,
  }
}
