import {
  Properties,
  ShadowBlurValue,
  ShadowOffsetValue,
  ShadowOpacityValue,
  ShadowSpreadValue,
  Theme,
  ThemeSwatch,
} from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { isValidColorValue } from "@seldon/core/helpers/type-guards/color/is-valid-color-value"
import { isThemeValueKey } from "@seldon/core/helpers/validation"
import { ShadowBrightnessValue } from "@seldon/core/properties/values/effects/shadow/shadow-brightness"

interface ResolvedShadow {
  offsetX?: ShadowOffsetValue
  offsetY?: ShadowOffsetValue
  blur?: ShadowBlurValue
  spread?: ShadowSpreadValue
  color?: ThemeSwatch
  opacity?: ShadowOpacityValue
  brightness?: ShadowBrightnessValue
}

export function getShadowFromProperties(
  properties: Properties,
  theme: Theme,
): ResolvedShadow | undefined {
  const preset = resolveValue(properties.shadow?.preset)

  if (!preset) return

  const themePreset = getThemeOption(preset.value, theme)

  const { offsetX, offsetY, blur, spread, color, opacity, brightness } =
    themePreset.parameters

  let backgroundColor: ThemeSwatch | undefined
  if (color && isValidColorValue(color)) {
    if (isThemeValueKey(color.value)) {
      backgroundColor = getThemeOption(color.value, theme)
    }
  }
  const result: ResolvedShadow = {}

  result.offsetX = resolveValue(offsetX)
  result.offsetY = resolveValue(offsetY)
  result.blur = resolveValue(blur)
  result.spread = resolveValue(spread)
  result.color = backgroundColor
  result.opacity = resolveValue(opacity)
  result.brightness = resolveValue(brightness)

  return result
}
