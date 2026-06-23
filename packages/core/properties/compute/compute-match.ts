import { EMPTY_VALUE, ValueType } from "../constants"
import type { ComputedMatchValue } from "../values/shared/computed/match"
import { getBasedOnValue } from "./get-based-on-value"
import { resolveMatchSource } from "./resolve-match-source"
import { ComputeContext } from "./types"

/** Editor label for `ComputedFunction.MATCH`. */
export const MATCH_DISPLAY_NAME = "Match"

/**
 * Replaces this computed slot with the color at the matched surface. The source comes from
 * {@link resolveMatchSource}. Degrades to `EMPTY` when the path cannot be resolved or still resolves
 * to a `COMPUTED` value, so an unresolved match never breaks compute or CSS generation.
 *
 * Match returns the raw value at the source. The sibling `brightness`/`opacity` are mirrored from
 * the matched source separately by `applyMatchColorMirror` during compound and layer resolution, so
 * the color itself is not baked here.
 *
 * @param value - Stored computed match value
 * @param context - Theme and contexts for `getBasedOnValue`
 * @returns The color at the matched surface, or `EMPTY` when it cannot be resolved
 */
export function computeMatch(
  value: ComputedMatchValue,
  context: ComputeContext,
) {
  let basedOnValue
  try {
    basedOnValue = getBasedOnValue(resolveMatchSource(), context)
  } catch {
    return EMPTY_VALUE
  }

  if (basedOnValue.type === ValueType.COMPUTED) {
    return EMPTY_VALUE
  }

  return basedOnValue
}
