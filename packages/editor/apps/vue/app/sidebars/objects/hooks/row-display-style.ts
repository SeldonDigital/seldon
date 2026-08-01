import { Display } from "@seldon/core"

import type { CSSProperties } from "vue"

/**
 * Maps a node's `Display` state, and any state inherited from its instance
 * ancestors, to its objects-sidebar row notation. One place for the
 * state-to-style rules, so the row label and the inline rename input cannot
 * drift apart. Ported from the React `row-display-style`.
 *
 * - SHOW: normal
 * - HIDE: italic
 * - STUB: normal
 * - MOCK: dimmed
 * - EXCLUDE: dimmed + italic
 */

/** States that dim the row to gray through the leaf `[aria-disabled]` style. */
export const DIMMED_DISPLAY_STATES: ReadonlySet<Display> = new Set([Display.MOCK, Display.EXCLUDE])

/** States that italicize the row label. */
export const ITALIC_DISPLAY_STATES: ReadonlySet<Display> = new Set([Display.HIDE, Display.EXCLUDE])

/**
 * Row decoration for an objects-sidebar row. `isDimmed` reads as gray and drives
 * `aria-disabled` on the row leaves. `dimStyle` stays on the shape for the row
 * consumers but is no longer produced by these rules. `labelStyle` carries the
 * italic label decoration, or is `undefined`.
 */
export interface RowDisplayDecoration {
  isDimmed: boolean
  dimStyle?: CSSProperties
  labelStyle?: CSSProperties
}

/**
 * Resolves the row decoration from the set of `Display` states affecting a node.
 * Pass the node's own state plus every state inherited from its instance
 * ancestors.
 */
export function resolveRowDisplayDecoration(states: Iterable<Display>): RowDisplayDecoration {
  let isDimmed = false
  let isItalic = false

  for (const state of states) {
    if (DIMMED_DISPLAY_STATES.has(state)) isDimmed = true
    if (ITALIC_DISPLAY_STATES.has(state)) isItalic = true
  }

  const decoration: RowDisplayDecoration = { isDimmed }

  if (isItalic) decoration.labelStyle = { fontStyle: "italic" }

  return decoration
}
