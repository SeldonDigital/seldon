import { InvariantError } from "../../helpers/utils/invariant"
import { COLOR_SIBLING_COMPOUND_KEYS, EMPTY_VALUE, ValueType } from "../constants"
import { Color } from "../values/appearance/color"
import type { ComputedMatchColorValue } from "../values/shared/computed/match-color"
import { getBasedOnValue } from "./get-based-on-value"
import { resolveMatchColorSource } from "./resolve-match-color-source"
import { ComputeContext, ComputeKeys } from "./types"

/** Transparent option paint used to blend a Match Color border with its fill. */
const TRANSPARENT_VALUE = {
  type: ValueType.OPTION,
  value: Color.TRANSPARENT,
} as const

/** True when the computed slot is a border compound's `color` facet. */
function isBorderColorTarget(keys?: ComputeKeys): boolean {
  if (!keys || keys.subPropertyKey !== "color") return false
  return (COLOR_SIBLING_COMPOUND_KEYS as readonly string[]).includes(
    keys.propertyKey,
  )
}

/**
 * Replaces this computed slot with the color at the matched surface. The source comes from
 * {@link resolveMatchColorSource}. Degrades to `EMPTY` when the path cannot be resolved or still
 * resolves to a `COMPUTED` value, so an unresolved match never breaks compute or CSS generation.
 *
 * A border resolves to `transparent` instead of the matched color. CSS paints the fill under the
 * border (`background-clip: border-box`), so a same-color border would composite over the fill and
 * darken at reduced opacity. A transparent border lets the fill show through, so it blends at every
 * opacity and stays identical at full opacity. Non-border targets return the raw matched color; the
 * sibling `brightness`/`opacity` are mirrored separately by `applyMatchColorMirror`.
 *
 * @param value - Stored computed match-color value
 * @param context - Theme and contexts for `getBasedOnValue`
 * @param keys - The property and facet being resolved, used to detect a border color slot
 * @returns The matched surface color, `transparent` for a border, or `EMPTY` when unresolved
 */
export function computeMatchColor(
  value: ComputedMatchColorValue,
  context: ComputeContext,
  keys?: ComputeKeys,
) {
  let basedOnValue
  try {
    basedOnValue = getBasedOnValue(resolveMatchColorSource(), context)
  } catch (error) {
    // An unresolved source degrades to EMPTY; a compound value at the path is
    // an authoring bug and must surface.
    if (error instanceof InvariantError) throw error
    return EMPTY_VALUE
  }

  if (basedOnValue.type === ValueType.COMPUTED) {
    return EMPTY_VALUE
  }

  if (isBorderColorTarget(keys)) {
    return TRANSPARENT_VALUE
  }

  return basedOnValue
}
