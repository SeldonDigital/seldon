import { EMPTY_VALUE, ValueType } from "../constants"
import type { ComputedMatchValue } from "../values/shared/computed/match"
import { getBasedOnValue } from "./get-based-on-value"
import { ComputeContext } from "./types"

/** Editor label for `ComputedFunction.MATCH`. */
export const MATCH_DISPLAY_NAME = "Match"

/**
 * Replaces this computed slot with the primitive value at `basedOn`. Missing `basedOn` becomes
 * `#parent.buttonSize`. Degrades to `EMPTY` when the `basedOn` path cannot be resolved or still
 * resolves to a `COMPUTED` value, so an unresolved match never breaks compute or CSS generation.
 *
 * Match returns the raw value at `basedOn`. For a color facet, the sibling `brightness`/`opacity`
 * are mirrored from the matched source separately by `applyMatchColorMirror` during compound and
 * layer resolution, so the color itself is not baked here.
 *
 * @param value - Stored computed match value
 * @param context - Theme and contexts for `getBasedOnValue`
 * @returns The value at the `basedOn` path, or `EMPTY` when it cannot be resolved
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

  let basedOnValue
  try {
    basedOnValue = getBasedOnValue(valueWithDefaults, context)
  } catch {
    return EMPTY_VALUE
  }

  if (basedOnValue.type === ValueType.COMPUTED) {
    return EMPTY_VALUE
  }

  return basedOnValue
}
