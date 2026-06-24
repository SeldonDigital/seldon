/**
 * Utility functions for formatting display values in property controls
 */
import {
  ComputedFunction,
  Theme,
  Value,
  ValueType,
  Workspace,
} from "@seldon/core"
import { formatValue } from "@seldon/core/helpers/properties/properties-bridge"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import { COMPUTED_FUNCTION_DISPLAY_NAMES } from "@seldon/core/properties/compute"
import { DEFAULT_COMPUTED_DISPLAY } from "./property-control-constants"

type Option = { value: string; name: string }
type OptionGroup = Option[]

/**
 * Formats computed value for display
 */
export function formatComputedDisplayValue(
  propertyValue: Value,
  options?: Option[] | OptionGroup[],
): string | null {
  if (
    !propertyValue ||
    typeof propertyValue !== "object" ||
    propertyValue === null ||
    !("type" in propertyValue) ||
    propertyValue.type !== ValueType.COMPUTED
  ) {
    return null
  }

  if ("value" in propertyValue && typeof propertyValue.value === "string") {
    const functionName = propertyValue.value as string

    if (options) {
      const flatOptions = Array.isArray(options[0])
        ? (options as OptionGroup[]).flat()
        : (options as Option[])
      const matchingOption = flatOptions.find(
        (option) => option.value === functionName,
      )
      if (matchingOption) {
        return matchingOption.name
      }
    }

    return (
      COMPUTED_FUNCTION_DISPLAY_NAMES[functionName as ComputedFunction] ||
      DEFAULT_COMPUTED_DISPLAY
    )
  }

  return DEFAULT_COMPUTED_DISPLAY
}

/**
 * Formats theme value for display using option names
 * This is a UI optimization to use option names when available
 */
export function formatThemeDisplayValue(
  propertyValue: Value,
  rawValue: string,
  options: Option[] | OptionGroup[] | undefined,
): string | null {
  if (
    !propertyValue ||
    typeof propertyValue !== "object" ||
    propertyValue === null ||
    !("type" in propertyValue) ||
    (propertyValue.type !== ValueType.THEME_ORDINAL &&
      propertyValue.type !== ValueType.THEME_CATEGORICAL) ||
    !options
  ) {
    return null
  }

  const flatOptions = Array.isArray(options[0])
    ? (options as OptionGroup[]).flat()
    : (options as Option[])

  const matchingOption = flatOptions.find((option) => option.value === rawValue)

  return matchingOption ? matchingOption.name : null
}

/**
 * Formats exact enum value for display using option names
 * Handles EXACT enum values (like Harmony) that have options
 */
export function formatExactEnumDisplayValue(
  propertyValue: Value,
  options: Option[] | OptionGroup[] | undefined,
): string | null {
  if (
    !propertyValue ||
    typeof propertyValue !== "object" ||
    propertyValue === null ||
    !("type" in propertyValue) ||
    propertyValue.type !== ValueType.EXACT ||
    !options ||
    options.length === 0
  ) {
    return null
  }

  const rawValue = stringifyValue(propertyValue)
  if (!rawValue) return null

  // Handle both flat arrays and nested arrays (option groups)
  const flatOptions =
    Array.isArray(options[0]) &&
    options[0].length > 0 &&
    "value" in options[0][0]
      ? (options as OptionGroup[]).flat()
      : (options as Option[])

  if (flatOptions.length === 0) {
    return null
  }

  const matchingOption = flatOptions.find((option) => option.value === rawValue)

  return matchingOption ? matchingOption.name : null
}

/**
 * Gets the display value for a property
 *
 * Uses the core formatValue function for consistent capitalization and formatting.
 * Falls back to option matching for theme values and exact enum values as a UI optimization.
 *
 * @param propertyValue - The property value to format
 * @param propertyKey - The property key (e.g., "color", "fontSize")
 * @param nodeId - The node ID for context
 * @param workspace - The workspace for context
 * @param theme - Optional theme for theme value formatting
 * @param options - Optional UI options for theme value matching optimization
 * @returns Formatted display string
 */
export function getDisplayValue(
  propertyValue: Value,
  propertyKey: string,
  nodeId: string,
  workspace: Workspace,
  theme?: Theme,
  options?: Option[] | OptionGroup[],
): string {
  // Check for computed value first (handled consistently)
  const computedDisplay = formatComputedDisplayValue(propertyValue, options)
  if (computedDisplay) return computedDisplay

  // For exact enum values (like Harmony), try option matching
  if (options) {
    const exactEnumDisplay = formatExactEnumDisplayValue(propertyValue, options)
    if (exactEnumDisplay) return exactEnumDisplay
  }

  // For theme values, try option matching first (UI optimization)
  // This allows UI-specific option names to be used when available
  if (
    propertyValue &&
    typeof propertyValue === "object" &&
    "type" in propertyValue &&
    (propertyValue.type === ValueType.THEME_ORDINAL ||
      propertyValue.type === ValueType.THEME_CATEGORICAL) &&
    options
  ) {
    const rawValue = stringifyValue(propertyValue)
    if (rawValue) {
      const themeDisplay = formatThemeDisplayValue(
        propertyValue,
        rawValue,
        options,
      )
      if (themeDisplay) return themeDisplay
    }
  }

  // Use core formatValue for all other cases and as fallback for theme values
  // This ensures consistent capitalization and formatting across all value types
  return formatValue(propertyKey, propertyValue, nodeId, workspace, theme)
}
