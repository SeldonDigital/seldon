import { REF_CARD_DEFAULT_SIZE } from "@seldon/editor/lib/canvas/connectors/connector-layout"

import type { ResizeSide } from "@seldon/components/utils/resize"
import type { RefCardPosition } from "@seldon/editor/lib/canvas/connectors/connector-layout"

interface RefCardSize {
  width: number
  height: number
}

/**
 * The size the next ref card opens at.
 *
 * Shared rather than kept per card, because resizing one card says how much room
 * these cards need, not how much that one ref needs. Read at open time only, so it
 * is a plain module value rather than a store: no card re-renders when it changes.
 *
 * Not persisted, since the bindings behind the cards are loaded per session.
 */
let refCardSize: RefCardSize = REF_CARD_DEFAULT_SIZE

export function getRefCardSize(): RefCardSize {
  return refCardSize
}

export function setRefCardSize(size: RefCardSize): void {
  refCardSize = size
}

/**
 * The edges a card offers to drag, which are the ones facing into the screen.
 *
 * A card opening below its chip grows down and left, and one opening above grows up
 * and left. Offering the anchored edges would let a drag pull the card over its chip.
 */
const RESIZE_SIDES: Record<RefCardPosition["opens"], ResizeSide[]> = {
  below: ["left", "bottom", "bottom-left"],
  above: ["left", "top", "top-left"],
}

export function getRefCardResizeSides(opens: RefCardPosition["opens"]): ResizeSide[] {
  return RESIZE_SIDES[opens]
}
