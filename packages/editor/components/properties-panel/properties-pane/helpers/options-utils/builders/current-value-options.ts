import { Theme } from "@seldon/core"
import { PropertyOption } from "../formatters/option-normalizer"
import { getCurrentValueOption } from "../formatters/value-formatter"

/**
 * Builds current value option if it's custom and not already in presets
 * @param property - Property object containing the current value
 * @param presetOptions - Array of preset options to check against
 * @param theme - Optional theme for value resolution
 * @returns Array containing the current value option if it's custom, empty array otherwise
 */
export function buildCurrentValueOption(
  property: { value: unknown },
  presetOptions: PropertyOption[],
  theme?: Theme,
): PropertyOption[] {
  const currentValueOption = getCurrentValueOption(property, theme)
  if (!currentValueOption) {
    return []
  }

  const isPresetValue = presetOptions.some(
    (preset) => preset.value === currentValueOption.value,
  )

  if (!isPresetValue) {
    return [currentValueOption]
  }

  return []
}
