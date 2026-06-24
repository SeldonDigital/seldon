import { EMPTY_VALUE, ValueType } from "../constants"
import type { ComputedMatchColorValue } from "../values/shared/computed/match-color"
import { getBasedOnValue } from "./get-based-on-value"
import { resolveMatchColorSource } from "./resolve-match-color-source"
import { ComputeContext } from "./types"

/** Editor label for `ComputedFunction.MATCH_COLOR`. */
export const MATCH_COLOR_DISPLAY_NAME = "Match Color"

/**
 * Replaces this computed slot with the color at the matched surface. The source comes from
 * {@link resolveMatchColorSource}. Degrades to `EMPTY` when the path cannot be resolved or still
 * resolves to a `COMPUTED` value, so an unresolved match never breaks compute or CSS generation.
 *
 * Match Color returns the raw value at the source. The sibling `brightness`/`opacity` are mirrored
 * from the matched source separately by `applyMatchColorMirror` during compound and layer
 * resolution, so the color itself is not baked here.
 *
 * @param value - Stored computed match-color value
 * @param context - Theme and contexts for `getBasedOnValue`
 * @returns The color at the matched surface, or `EMPTY` when it cannot be resolved
 */
export function computeMatchColor(
  value: ComputedMatchColorValue,
  context: ComputeContext,
) {
  let basedOnValue
  try {
    basedOnValue = getBasedOnValue(resolveMatchColorSource(), context)
  } catch {
    return EMPTY_VALUE
  }

  if (basedOnValue.type === ValueType.COMPUTED) {
    return EMPTY_VALUE
  }

  return basedOnValue
}
