import { createStore } from "../store/observable"

import type { GutterSide } from "./connector-layout"

export interface BadgeGutterState {
  /**
   * The canvas edge the token badge column currently hangs off, or `null` when no
   * token badges are drawn.
   *
   * Published by the token overlay so the reference overlay can favor the opposite
   * edge. It is a soft bias: the reference column still moves to the crowded edge
   * when it has to, so the two may mix rather than never touch.
   */
  tokenSide: GutterSide | null
}

export const badgeGutterStore = createStore<BadgeGutterState>({ tokenSide: null })

/** Records the edge the token column hangs off, or clears it when none is drawn. */
export function setTokenGutterSide(side: GutterSide | null): void {
  if (badgeGutterStore.getState().tokenSide === side) return

  badgeGutterStore.setState({ tokenSide: side })
}

/** The edge a reference column should favor: opposite the token column, or `null`. */
export function getRefPreferredSide(current: GutterSide): GutterSide {
  const tokenSide = badgeGutterStore.getState().tokenSide

  if (!tokenSide) return current

  return tokenSide === "right" ? "left" : "right"
}
