import { ValueType } from "../properties/constants/value-types"
import { ComputedMatchValue } from "../properties/values/computed/match"
import { getBasedOnValue } from "./get-based-on-value"
import { ComputeContext } from "./types"

/**
 * Copies a value from another property, enabling property inheritance.
 *
 * @param value - The computed match value with basedOn reference
 * @param context - The computation context containing theme and parent data
 * @returns The resolved value from the referenced property
 */
export function computeMatch(
  value: ComputedMatchValue,
  context: ComputeContext,
) {
  const basedOnValue = getBasedOnValue(value, context)

  if (basedOnValue.type === ValueType.COMPUTED) {
    throw new Error("The value being matched cannot be a computed value.")
  }

  return basedOnValue
}
