import { ComputedFunction, ValueType } from "@seldon/core"
import {
  Board,
  Instance,
  Variant,
  Workspace,
} from "@seldon/core/workspace/types"
import { getNodePropertiesWithStatus } from "./properties-data"

/**
 * Creates a computed value. The payload is the bare `ComputedFunction`; source resolution lives in
 * the core compute functions, so the stored value is identical whether the editor or an AI agent
 * writes it.
 */
export function createComputedValue(computedFunction: ComputedFunction): {
  type: ValueType.COMPUTED
  value: ComputedFunction
} {
  return {
    type: ValueType.COMPUTED,
    value: computedFunction,
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
