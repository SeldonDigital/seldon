import {
  BorderStyleValue,
  BorderWidthValue,
  Display,
  PercentageValue,
  Properties,
} from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { isValidColorValue } from "@seldon/core/helpers/type-guards/color/is-valid-color-value"
import { isThemeValueKey } from "@seldon/core/helpers/validation"
import { BorderBrightnessValue } from "@seldon/core/properties/values/appearance/border/border-brightness"
import { Theme, ThemeSwatch } from "@seldon/core/themes/types"

interface ResolvedBorder {
  display: Display
  width?: BorderWidthValue
  style?: BorderStyleValue
  color?: ThemeSwatch
  opacity?: PercentageValue
  brightness?: BorderBrightnessValue
}

export function resolveBorder(
  properties: Properties,
  theme: Theme,
): ResolvedBorder | undefined {
  const preset = resolveValue(properties.border?.preset)

  if (!preset) return

  const themePreset = getThemeOption(preset.value, theme)

  const colorValue =
    resolveValue(properties.border?.color) ||
    resolveValue(themePreset.parameters.color)

  let color: ThemeSwatch | undefined
  if (colorValue && isValidColorValue(colorValue)) {
    if (isThemeValueKey(colorValue.value)) {
      color = getThemeOption(colorValue.value, theme)
    }
  }

  return {
    display: Display.SHOW,
    width:
      resolveValue(properties.border?.width) ||
      resolveValue(themePreset.parameters.width),
    style:
      resolveValue(properties.border?.style) ||
      resolveValue(themePreset.parameters.style),
    color,
    opacity:
      resolveValue(properties.border?.opacity) ||
      resolveValue(themePreset.parameters.opacity),
    brightness:
      resolveValue(properties.border?.brightness) ||
      resolveValue(themePreset.parameters.brightness),
  }
}
