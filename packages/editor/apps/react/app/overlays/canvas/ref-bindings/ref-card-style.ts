import { getResizeHandleStyle } from "@seldon/components/utils/resize"

import type { ResizeSide } from "@seldon/components/utils/resize"
import type { RefCardPosition } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { CSSProperties } from "react"

/**
 * Where the ref card draws and where its resize handles sit. How the card looks comes
 * from the `PanelRefs` schema.
 */

/** Above every board and overlay, since the card is portaled out of the canvas. */
const CARD_Z_INDEX = 2147483000

/** Size of the card, in viewport pixels. */
export interface RefCardSize {
  width: number
  height: number
}

/**
 * The box the card fills, kept apart from how it looks.
 *
 * The card is anchored by its right edge, so dragging its left edge widens it in
 * place. One of `top` and `bottom` is set, whichever side of the chip it opens on.
 *
 * The size is clamped to the room on that side, which is what makes the card scroll
 * rather than run off screen when a resize outgrows the space it opened in.
 */
export function refCardWrapperStyle(position: RefCardPosition, size: RefCardSize): CSSProperties {
  return {
    position: "fixed",
    top: position.top === undefined ? undefined : `${position.top}px`,
    bottom: position.bottom === undefined ? undefined : `${position.bottom}px`,
    right: `${position.right}px`,
    width: `${Math.min(size.width, position.maxWidth)}px`,
    height: `${Math.min(size.height, position.maxHeight)}px`,
    zIndex: CARD_Z_INDEX,
    pointerEvents: "auto",
  }
}

/** One resize handle, over the card's own content so a drag near the edge reaches it. */
export function refCardHandleStyle(side: ResizeSide): CSSProperties {
  return {
    ...getResizeHandleStyle(side),
    zIndex: 1,
    pointerEvents: "auto",
  }
}

/** Holds the line breaks in a slot that carries several lines in one Text. */
export const refCardMultilineStyle: CSSProperties = { whiteSpace: "pre-line" }
