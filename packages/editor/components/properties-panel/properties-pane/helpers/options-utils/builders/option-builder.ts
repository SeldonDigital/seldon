import { ComponentLevel, Theme } from "@seldon/core"
import { PropertySchema } from "@seldon/core/properties/types/schema"
import { PropertyOption } from "../formatters/option-normalizer"
import { buildComputedOptions } from "./computed-options"
import { buildCurrentValueOption } from "./current-value-options"
import { buildDefaultOptions } from "./default-options"
import { buildPresetOptions } from "./preset-options"
import { buildThemeOptions } from "./theme-options"

export interface PropertyOptionsResult {
  options: PropertyOption[][]
  hasCurrentValue: boolean
  currentValueOption?: PropertyOption
}

/**
 * Builds all option groups for a property in a specific order
 * @param property - Property object containing key, value, and optional allowed values
 * @param schema - Property schema defining available options and functions
 * @param theme - Optional theme for value resolution
 * @param componentLevel - Optional component level for filtering computed functions
 * @returns Object containing grouped options, current value info, and metadata
 */
export function buildPropertyOptions(
  property: { key: string; value: unknown; allowedValues?: string[] },
  schema: PropertySchema,
  theme?: Theme,
  componentLevel?: ComponentLevel,
): PropertyOptionsResult {
  const groups: PropertyOption[][] = []

  // Group 1: Default + Inherit
  const defaultGroup = buildDefaultOptions(schema)
  groups.push(defaultGroup)

  // Group 2: Preset options
  const presetOptions = buildPresetOptions(
    schema,
    property.allowedValues,
    theme,
  )
  if (presetOptions.length > 0) {
    groups.push(presetOptions)
  }

  // Group 3: Current value (if custom and not already in presets)
  const currentValueOptions = buildCurrentValueOption(
    property,
    presetOptions,
    theme,
  )
  if (currentValueOptions.length > 0) {
    groups.push(currentValueOptions)
  }

  // Group 4: Computed options
  if (schema.computedFunctions) {
    const computedOptions = buildComputedOptions(
      schema.computedFunctions(),
      componentLevel,
      undefined, // Don't filter computed functions by allowedValues
      theme,
    )
    if (computedOptions.length > 0) {
      groups.push(computedOptions)
    }
  }

  // Group 5: Theme options
  if (theme) {
    const themeOptions = buildThemeOptions(
      schema,
      theme,
      property.allowedValues,
    )
    if (themeOptions.length > 0) {
      groups.push(themeOptions)
    }
  }

  // Check if current value should be shown as a custom option
  const currentValueOption =
    currentValueOptions.length > 0 ? currentValueOptions[0] : null
  const hasCurrentValue = currentValueOption !== null

  return {
    options: groups,
    hasCurrentValue,
    currentValueOption: currentValueOption || undefined,
  }
}
