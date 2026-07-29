import type { CSSProperties } from "react"

/**
 * The little the ref card needs on top of its schema. `WindowSurface` places the card
 * and draws its resize handles, and `PanelRefs` says how it looks.
 */

/**
 * Fills the surface, so the box the reader drags is the box the card paints.
 *
 * The board's own size and padding go, because the surface owns both once the card
 * floats and is resizable.
 */
export const refCardPanelStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  padding: 0,
}

/** Holds the line breaks in a slot that carries several lines in one Text. */
export const refCardMultilineStyle: CSSProperties = { whiteSpace: "pre-line" }
