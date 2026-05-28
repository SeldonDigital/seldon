import { ValueType } from "../constants"
import type { ComputedMatchValue } from "../values/shared/computed/match"
import { getBasedOnValue } from "./get-based-on-value"
import { ComputeContext } from "./types"

/** Editor label for `ComputedFunction.MATCH`. */
export const MATCH_DISPLAY_NAME = "Match"

/**
 * Replaces this computed slot with the primitive value at `basedOn`. Missing `basedOn` becomes
 * `#parent.buttonSize`. Throws when the value at `basedOn` is still `COMPUTED`.
 *
 * @param value - Stored computed match value
 * @param context - Theme and contexts for `getBasedOnValue`
 * @returns The value object returned for the `basedOn` path
 * @throws When the resolved value at `basedOn` has type `COMPUTED`
 */
export function computeMatch(
  value: ComputedMatchValue,
  context: ComputeContext,
) {
  const basedOn = value.value.input.basedOn || "#parent.buttonSize"

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
