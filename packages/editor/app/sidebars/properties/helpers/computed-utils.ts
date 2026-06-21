import { ComputedFunction, ValueType } from "@seldon/core"
import {
  Board,
  Instance,
  Variant,
  Workspace,
} from "@seldon/core/workspace/types"
import { getNodePropertiesWithStatus } from "./properties-data"

/** Context needed to build a complete computed input. */
export interface ComputedValueContext {
  /** Current effective value of the property slot being changed. */
  currentValue?: unknown
  workspace: Workspace
  node: Variant | Instance | Board | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/**
 * Extracts the input of the current value when it is a computed value using
 * the same function, so re-selecting a function keeps authored input fields.
 */
function getExistingInput(
  computedFunction: ComputedFunction,
  currentValue: unknown,
): Record<string, unknown> {
  if (
    isRecord(currentValue) &&
    currentValue.type === ValueType.COMPUTED &&
    isRecord(currentValue.value) &&
    currentValue.value.function === computedFunction &&
    isRecord(currentValue.value.input)
  ) {
    return { ...currentValue.value.input }
  }
  return {}
}

function getDefaultInput(
  computedFunction: ComputedFunction,
  workspace: Workspace,
  node: Variant | Instance | Board | null,
): Record<string, unknown> {
  switch (computedFunction) {
    case ComputedFunction.AUTO_FIT:
      return { basedOn: "#parent.buttonSize", factor: 1 }
    case ComputedFunction.OPTICAL_PADDING:
      return {
        basedOn: node
          ? getSuggestedBasedOnPath(workspace, node)
          : "#parent.fontSize",
        factor: 1.5,
      }
    case ComputedFunction.HIGH_CONTRAST_COLOR:
      return { basedOn: "#self.background.color" }
    case ComputedFunction.MATCH:
      return {
        basedOn: node
          ? getSuggestedBasedOnPath(workspace, node)
          : "#parent.fontSize",
      }
  }
}

/**
 * Creates a computed value with a complete input. Workspace files must stay
 * standalone, so every written computed value carries a full input instead of
 * relying on compute-time fallbacks. Input fields from a current value using
 * the same function carry forward over the defaults.
 */
export function createComputedValue(
  computedFunction: ComputedFunction,
  context: ComputedValueContext,
): Record<string, unknown> {
  const input = {
    ...getDefaultInput(computedFunction, context.workspace, context.node),
    ...getExistingInput(computedFunction, context.currentValue),
  }
  return {
    type: ValueType.COMPUTED,
    value: {
      function: computedFunction,
      input,
    },
  }
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
 * Validates whether the current node has enough context to apply a computed function safely
 * @param computedFunction - The computed function to validate
 * @param workspace - Current workspace
 * @param node - Node to check context for
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
 * Suggests a basedOn path for a computed input, probing in priority order
 * @param workspace - Current workspace
 * @param node - Node to suggest path for
 * @returns Suggested basedOn path
 */
export function getSuggestedBasedOnPath(
  workspace: Workspace,
  node: Variant | Instance | Board,
): string {
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
