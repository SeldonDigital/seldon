import { ComponentLevel, ComputedFunction, Theme } from "@seldon/core"
import { getComputedFunctionDisplayName } from "../../computed-utils"
import { normalizeOptions } from "../formatters/option-normalizer"
import { PropertyOption } from "../formatters/option-normalizer"

/**
 * Builds computed function options for property selection
 * @param computedFunctions - Array of computed functions to include
 * @param componentLevel - Component level to filter functions (e.g., primitive vs interactive)
 * @param allowedValues - Optional array of allowed values to filter against
 * @param theme - Optional theme for value resolution
 * @returns Array of normalized property options
 */
export function buildComputedOptions(
  computedFunctions: ComputedFunction[],
  componentLevel?: ComponentLevel,
  allowedValues?: string[],
  theme?: Theme,
): PropertyOption[] {
  const filteredFunctions = computedFunctions.filter((fn) => {
    // OPTICAL_PADDING should only be available for interactive elements, not primitives
    if (fn === ComputedFunction.OPTICAL_PADDING) {
      return componentLevel !== ComponentLevel.PRIMITIVE
    }
    return true
  })

  return normalizeOptions(
    filteredFunctions.map((fn) => ({
      value: fn,
      name: getComputedFunctionDisplayName(fn),
    })),
    allowedValues,
    theme,
  )
}
