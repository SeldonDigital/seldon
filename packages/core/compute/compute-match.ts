import { ValueType } from "../properties"
import { ComputedMatchValue } from "../properties/values/shared/computed/match"
import { getBasedOnValue } from "./get-based-on-value"
import { ComputeContext } from "./types"

/**
 * Display name for this computed function (used by editor UI)
 */
export const MATCH_DISPLAY_NAME = "Match"

/**
 * Copies a value from another property, enabling property inheritance.
 * Handles missing parameters with sensible defaults.
 *
 * @param value - The computed match value with basedOn reference
 * @param context - The computation context containing theme and parent data
 * @returns The resolved value from the referenced property
 */
export function computeMatch(
  value: ComputedMatchValue,
  context: ComputeContext,
) {
  // Use default if basedOn not provided
  const basedOn = value.value.input.basedOn || "#parent.buttonSize"

  // Create value with defaults applied
  const valueWithDefaults = {
    ...value,
    value: {
      ...value.value,
      input: { basedOn },
    },
  }

  const basedOnValue = getBasedOnValue(valueWithDefaults, context)

  if (basedOnValue.type === ValueType.COMPUTED) {
    throw new Error("The value being matched cannot be a computed value.")
  }

  return basedOnValue
}
