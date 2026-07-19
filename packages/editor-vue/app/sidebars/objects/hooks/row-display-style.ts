import type { CSSProperties } from "vue"
import { Display } from "@seldon/core"

/**
 * Maps a node's `Display` state, and any state inherited from its instance
 * ancestors, to its objects-sidebar row notation. One place for the
 * state-to-style rules, so the row label and the inline rename input cannot
 * drift apart. Ported from the React `row-display-style`.
 *
 * - SHOW: normal
 * - HIDE: dimmed
 * - STUB: dimmed + italic
 * - MOCK: dimmed + faded
 * - EXCLUDE: dimmed + italic + faded
 */

/** Opacity applied to the icon and label of a faded row, over its gray color. */
const FADED_OPACITY = 0.65

/** States that dim the row to gray through the leaf `[aria-disabled]` style. */
export const DIMMED_DISPLAY_STATES: ReadonlySet<Display> = new Set([
  Display.HIDE,
  Display.STUB,
  Display.MOCK,
  Display.EXCLUDE,
])

/** States that fade the row's gray. */
export const FADED_DISPLAY_STATES: ReadonlySet<Display> = new Set([
  Display.MOCK,
  Display.EXCLUDE,
])

/** States that italicize the row label. */
export const ITALIC_DISPLAY_STATES: ReadonlySet<Display> = new Set([
  Display.STUB,
  Display.EXCLUDE,
])

export interface RowDisplayDecoration {
  /** Row reads as disabled/gray. Drives `aria-disabled` on the row leaves. */
  isDimmed: boolean
  /** Faded appearance, applied to the icon and label leaves. */
  dimStyle?: CSSProperties
  /** Inline label decoration (italic), or `undefined`. */
  labelStyle?: CSSProperties
}

/**
 * Resolves the row decoration from the set of `Display` states affecting a node.
 * Pass the node's own state plus every state inherited from its instance
 * ancestors.
 */
export function resolveRowDisplayDecoration(
  states: Iterable<Display>,
): RowDisplayDecoration {
  let isDimmed = false
  let isFaded = false
  let isItalic = false

  for (const state of states) {
    if (DIMMED_DISPLAY_STATES.has(state)) isDimmed = true
    if (FADED_DISPLAY_STATES.has(state)) isFaded = true
    if (ITALIC_DISPLAY_STATES.has(state)) isItalic = true
  }

  const decoration: RowDisplayDecoration = { isDimmed }
  if (isFaded) decoration.dimStyle = { opacity: FADED_OPACITY }
  if (isItalic) decoration.labelStyle = { fontStyle: "italic" }
  return decoration
}
