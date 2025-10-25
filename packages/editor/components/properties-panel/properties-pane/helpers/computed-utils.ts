import { ComponentLevel, ComputedFunction, ValueType } from "@seldon/core"
import { COMPUTED_FUNCTION_DISPLAY_NAMES } from "@seldon/core/compute"
import { getPropertySchema } from "@seldon/core/properties/schemas"
import {
  Board,
  Instance,
  Variant,
  Workspace,
} from "@seldon/core/workspace/types"
import { getNodePropertiesWithStatus } from "./properties-data"

/**
 * Creates a computed value structure with empty input objects
 * @param computedFunction - The computed function to use
 * @returns Computed value object with empty input
 */
export function createComputedValue(
  computedFunction: ComputedFunction,
): Record<string, unknown> {
  const input: Record<string, unknown> = {}
  return {
    type: ValueType.COMPUTED,
    value: {
      function: computedFunction,
      input,
    },
  }
}

/**
 * Gets display name for a computed function
 * @param fn - The computed function
 * @returns Human-readable display name
 */
export function getComputedFunctionDisplayName(fn: ComputedFunction): string {
  return COMPUTED_FUNCTION_DISPLAY_NAMES[fn] || "Computed"
}

/**
 * Checks if property supports computed functions
 * @param propertyKey - The property key to check
 * @returns True if property supports computed functions
 */
export function isComputedProperty(propertyKey: string): boolean {
  const schema = getPropertySchema(propertyKey)
  const fns = schema?.computedFunctions?.() || []
  return fns.length > 0
}

/**
 * Gets which computed functions a property supports, filtered by component type
 * @param propertyKey - The property key to check
 * @param componentLevel - Optional component level for filtering
 * @returns Array of supported computed functions
 */
export function getSupportedComputedFunctions(
  propertyKey: string,
  componentLevel?: ComponentLevel,
): ComputedFunction[] {
  const schema = getPropertySchema(propertyKey)
  const supportedFunctions = schema?.computedFunctions?.() || []

  return supportedFunctions.filter((fn) => {
    if (fn === ComputedFunction.OPTICAL_PADDING) {
      return componentLevel !== ComponentLevel.PRIMITIVE
    }
    return true
  })
}

/**
 * Checks if a value is a valid computed function option
 * @param value - The value to check
 * @returns True if value is a valid computed function
 */
export function isComputedFunctionOption(value: string): boolean {
  return Object.values(ComputedFunction).includes(value as ComputedFunction)
}

/**
 * Gets computed function from option value with validation
 * @param value - The option value
 * @returns The computed function
 * @throws Error if value is not a valid computed function
 */
export function getComputedFunctionFromOption(value: string): ComputedFunction {
  if (!isComputedFunctionOption(value)) {
    throw new Error(`Invalid computed function option: ${value}`)
  }
  return value as ComputedFunction
}

/**
 * Gets the display value for a computed property
 * @param propertyKey - The property key
 * @param computedValue - The computed value object
 * @returns Display string for the computed property
 */
export function getComputedPropertyDisplayValue(
  propertyKey: string,
  computedValue: unknown,
): string {
  if (!isComputedProperty(propertyKey) || !computedValue) {
    return "Default"
  }

  if (
    typeof computedValue !== "object" ||
    computedValue === null ||
    !("type" in computedValue) ||
    computedValue.type !== ValueType.COMPUTED
  ) {
    return "Default"
  }

  if (
    "value" in computedValue &&
    computedValue.value &&
    typeof computedValue.value === "object" &&
    "function" in computedValue.value
  ) {
    const functionName = (computedValue.value as Record<string, unknown>)
      .function
    return getComputedFunctionDisplayName(functionName as ComputedFunction)
  }

  return "Computed"
}

/**
 * Gets available computed function options for a property
 * @param propertyKey - The property key
 * @param componentLevel - Optional component level for filtering
 * @returns Array of option groups containing computed function options
 */
export function getComputedPropertyOptions(
  propertyKey: string,
  componentLevel?: ComponentLevel,
): Array<{ value: string; name: string }>[] {
  if (!isComputedProperty(propertyKey)) {
    return []
  }

  const groups: Array<{ value: string; name: string }>[] = []
  const suggestedFunctions = getSupportedComputedFunctions(
    propertyKey,
    componentLevel,
  )

  if (suggestedFunctions.length > 0) {
    const computedOptions = suggestedFunctions.map((fn) => ({
      value: fn,
      name: getComputedFunctionDisplayName(fn),
    }))
    groups.push(computedOptions)
  }

  return groups
}

/**
 * Handles sub-property modification when main property has a computed value
 * @param mainPropertyKey - The main property key
 * @param subPropertyKey - The sub-property key being modified
 * @param newSubPropertyValue - The new value for the sub-property
 * @param workspace - Current workspace
 * @param node - Node containing the property
 * @param theme - Optional theme
 * @returns Update object for the property changes
 */
export function handleSubPropertyModificationWithComputedParent(
  mainPropertyKey: string,
  subPropertyKey: string,
  newSubPropertyValue: unknown,
  workspace: Workspace,
  node: Variant | Instance | Board,
): Record<string, unknown> {
  const { properties } = getNodePropertiesWithStatus(node, workspace)
  const mainPropertyValue = (properties as Record<string, unknown>)[
    mainPropertyKey
  ]

  if (
    !mainPropertyValue ||
    typeof mainPropertyValue !== "object" ||
    mainPropertyValue === null ||
    !("type" in mainPropertyValue) ||
    mainPropertyValue.type !== ValueType.COMPUTED
  ) {
    return {
      [mainPropertyKey]: {
        ...(typeof mainPropertyValue === "object" && mainPropertyValue
          ? (mainPropertyValue as Record<string, unknown>)
          : {}),
        [subPropertyKey]: newSubPropertyValue,
      },
    }
  }

  const update: Record<string, unknown> = {
    [mainPropertyKey]: {},
  }

  // Get sub-property keys from the actual property value
  const subPropertyKeys =
    mainPropertyValue && typeof mainPropertyValue === "object"
      ? Object.keys(mainPropertyValue).filter((key) => key !== "preset")
      : []

  for (const key of subPropertyKeys) {
    if (key === subPropertyKey) {
      ;(update[mainPropertyKey] as Record<string, unknown>)[key] =
        newSubPropertyValue
    } else {
      ;(update[mainPropertyKey] as Record<string, unknown>)[key] = {
        type: ValueType.EMPTY,
        value: null,
      }
    }
  }

  return update
}

/**
 * Determines if a property should use computed property behavior
 * @param propertyKey - The property key to check
 * @returns True if property supports computed functions
 */
export function shouldUseComputedPropertyBehavior(
  propertyKey: string,
): boolean {
  return isComputedProperty(propertyKey)
}

/**
 * Validates whether the current node has enough context to apply a computed function safely
 * @param propertyKey - The property key
 * @param computedFunction - The computed function to validate
 * @param workspace - Current workspace
 * @param node - Node to check context for
 * @param theme - Optional theme
 * @returns True if computed function can be applied safely
 */
export function canApplyComputedSafely(
  computedFunction: ComputedFunction,
  workspace: Workspace,
  node: Variant | Instance | Board,
): boolean {
  if (computedFunction === ComputedFunction.OPTICAL_PADDING) {
    const { properties } = getNodePropertiesWithStatus(node, workspace)
    const font = (properties as Record<string, unknown>).font
    const buttonSize = (properties as Record<string, unknown>).buttonSize
    const hasFontSize = !!(
      font &&
      typeof font === "object" &&
      font !== null &&
      "size" in font &&
      font.size &&
      typeof font.size === "object" &&
      font.size !== null &&
      "type" in font.size &&
      font.size.type
    )
    const hasButtonSize = !!buttonSize
    return hasFontSize || hasButtonSize
  }
  return true
}

/**
 * Suggests a basedOn path for Optical Padding, probing in priority order
 * @param workspace - Current workspace
 * @param node - Node to suggest path for
 * @param theme - Optional theme
 * @returns Suggested basedOn path or null
 */
export function getSuggestedBasedOnPath(
  workspace: Workspace,
  node: Variant | Instance | Board,
): string | null {
  const { properties } = getNodePropertiesWithStatus(node, workspace)
  const font = (properties as Record<string, unknown>).font
  if (
    font &&
    typeof font === "object" &&
    font !== null &&
    "size" in font &&
    font.size &&
    typeof font.size === "object" &&
    font.size !== null &&
    "type" in font.size &&
    font.size.type
  )
    return "#font.size"
  if ((properties as Record<string, unknown>).buttonSize) return "#buttonSize"
  return "#parent.fontSize"
}
