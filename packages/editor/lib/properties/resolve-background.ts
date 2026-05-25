import {
  BackgroundPositionValue,
  BackgroundRepeat,
  PercentageValue,
  Properties,
  Theme,
  ThemeBackground,
  ThemeSwatch,
} from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { isValidColorValue } from "@seldon/core/helpers/type-guards/color/is-valid-color-value"
import { isThemeValueKey } from "@seldon/core/helpers/validation"
import { BackgroundBrightnessValue } from "@seldon/core/properties/values/appearance/background/background-brightness"
import { BackgroundSizeValue } from "@seldon/core/properties/values/appearance/background/background-size"

export interface ResolvedBackground {
  image?: string
  position?: BackgroundPositionValue
  repeat?: BackgroundRepeat
  color?: ThemeSwatch
  opacity?: PercentageValue
  size?: BackgroundSizeValue
  brightness?: BackgroundBrightnessValue
}

export function resolveBackground(
  properties: Properties,
  theme: Theme,
): ResolvedBackground | undefined {
  const preset = resolveValue(properties.background?.preset)

  if (!preset) return

  const themePreset = getThemeOption(preset.value, theme) as ThemeBackground

  const { image, position, repeat, opacity, color, size, brightness } =
    themePreset.parameters

  let backgroundColor: ThemeSwatch | undefined
  if (color && isValidColorValue(color)) {
    if (isThemeValueKey(color.value)) {
      backgroundColor = getThemeOption(color.value, theme)
    }
  }

  const result: ResolvedBackground = {}

  result.color = backgroundColor
  result.image = resolveValue(image)?.value
  result.position = resolveValue(position)
  result.repeat = resolveValue(repeat)?.value
  result.opacity = resolveValue(opacity)
  result.size = resolveValue(size)
  result.brightness = resolveValue(brightness)
  return result
}
