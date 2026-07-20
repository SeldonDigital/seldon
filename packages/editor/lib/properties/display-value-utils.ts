/**
 * Utility functions for formatting display values in property controls
 */
import { ComputedFunction, Theme, Value, ValueType } from "@seldon/core"
import { formatValue } from "@seldon/core/helpers/properties/properties-bridge"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import { COMPUTED_FUNCTION_DISPLAY_NAMES } from "@seldon/core/properties/compute"
import { DEFAULT_COMPUTED_DISPLAY } from "./property-control-constants"

type Option = { value: string; name: string }
type OptionGroup = Option[]

/** Finds the display name for a raw value among flat or grouped options. */
function findOptionName(
  rawValue: string,
  options: Option[] | OptionGroup[],
): string | null {
  const flatOptions = Array.isArray(options[0])
    ? (options as OptionGroup[]).flat()
    : (options as Option[])
  const matchingOption = flatOptions.find((option) => option.value === rawValue)
  return matchingOption ? matchingOption.name : null
}

/**
 * Formats computed value for display
 */
function formatComputedDisplayValue(
  propertyValue: Value,
  options?: Option[] | OptionGroup[],
): string | null {
  if (
    !propertyValue ||
    typeof propertyValue !== "object" ||
    !("type" in propertyValue) ||
    propertyValue.type !== ValueType.COMPUTED
  ) {
    return null
  }

  if ("value" in propertyValue && typeof propertyValue.value === "string") {
    const functionName = propertyValue.value as string

    if (options) {
      const optionName = findOptionName(functionName, options)
      if (optionName) return optionName
    }

    return (
      COMPUTED_FUNCTION_DISPLAY_NAMES[functionName as ComputedFunction] ||
      DEFAULT_COMPUTED_DISPLAY
    )
  }

  return DEFAULT_COMPUTED_DISPLAY
}

/**
 * Formats an enum value for display using its option names, so a stored key like
 * "rtl" shows as "Right to Left" instead of a title-cased raw value. Handles both
 * EXACT enums (like Harmony) and OPTION enums (like direction), since a closed
 * set can be stored under either type. Returns null when there is no options list
 * or no matching option, so the caller falls back to core formatting.
 */
function formatEnumOptionDisplayValue(
  propertyValue: Value,
  options: Option[] | OptionGroup[] | undefined,
): string | null {
  if (
    !propertyValue ||
    typeof propertyValue !== "object" ||
    !("type" in propertyValue) ||
    (propertyValue.type !== ValueType.EXACT &&
      propertyValue.type !== ValueType.OPTION) ||
    !options ||
    options.length === 0
  ) {
    return null
  }

  const rawValue = stringifyValue(propertyValue)
  if (!rawValue) return null

  return findOptionName(rawValue, options)
}

/**
 * Gets the display value for a property
 *
 * Uses the core formatValue function for consistent capitalization and formatting.
 * Falls back to option matching for theme values and exact enum values as a UI optimization.
 *
 * @param propertyValue - The property value to format
 * @param theme - Optional theme for theme value formatting
 * @param options - Optional UI options for theme value matching optimization
 * @returns Formatted display string
 */
export function getDisplayValue(
  propertyValue: Value,
  theme?: Theme,
  options?: Option[] | OptionGroup[],
): string {
  // Check for computed value first (handled consistently)
  const computedDisplay = formatComputedDisplayValue(propertyValue, options)
  if (computedDisplay) return computedDisplay

  // For enum values (EXACT or OPTION, like Harmony or direction), match names
  const enumOptionDisplay = formatEnumOptionDisplayValue(propertyValue, options)
  if (enumOptionDisplay) return enumOptionDisplay

  // For theme values, try option matching first (UI optimization)
  // This allows UI-specific option names to be used when available
  if (
    options &&
    propertyValue &&
    typeof propertyValue === "object" &&
    "type" in propertyValue &&
    (propertyValue.type === ValueType.THEME_ORDINAL ||
      propertyValue.type === ValueType.THEME_CATEGORICAL)
  ) {
    const rawValue = stringifyValue(propertyValue)
    if (rawValue) {
      const themeDisplay = findOptionName(rawValue, options)
      if (themeDisplay) return themeDisplay
    }
  }

  // Use core formatValue for all other cases and as fallback for theme values
  // This ensures consistent capitalization and formatting across all value types
  return formatValue(propertyValue, theme)
}
