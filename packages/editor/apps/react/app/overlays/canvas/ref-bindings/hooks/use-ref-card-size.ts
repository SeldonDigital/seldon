"use client"

import { createResizeHandle } from "@seldon/components/utils/resize"
import {
  REF_CARD_DEFAULT_SIZE,
  REF_CARD_MIN_SIZE,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { useMemo } from "react"
import { create } from "zustand"

import { refCardHandleStyle } from "../ref-card-style"

import type { RefCardSize } from "../ref-card-style"
import type { ResizeSide } from "@seldon/components/utils/resize"
import type { RefCardPosition } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { CSSProperties } from "react"

/** One resize handle, ready to render. */
export interface RefCardHandle {
  side: ResizeSide
  style: CSSProperties
  onPointerDown: (event: { clientX: number; clientY: number; preventDefault(): void }) => void
}

interface RefCardSizeState {
  size: RefCardSize
  setSize: (size: RefCardSize) => void
}

/**
 * The size every ref card opens at.
 *
 * Shared rather than kept per card, because resizing one card is a statement about how
 * much room these cards need, not about that one ref. Not persisted, since the bindings
 * behind the cards are only loaded for the session.
 */
const useStore = create<RefCardSizeState>((set) => ({
  size: REF_CARD_DEFAULT_SIZE,
  setSize: (size: RefCardSize) => set(() => ({ size })),
}))

export const useRefCardSize = (): RefCardSize => useStore((state) => state.size)

/**
 * The edges a card can be dragged by, which are the ones facing into the screen.
 *
 * A card opening below its chip grows down and left, and one opening above grows up
 * and left. Dragging the anchored edges instead would move the card off its chip.
 */
const RESIZE_SIDES: Record<RefCardPosition["opens"], ResizeSide[]> = {
  below: ["left", "bottom", "bottom-left"],
  above: ["left", "top", "top-left"],
}

export function getRefCardResizeSides(opens: RefCardPosition["opens"]): ResizeSide[] {
  return RESIZE_SIDES[opens]
}

/**
 * Wires the handles for one card. Each drag writes the shared size and ignores the x
 * and y the drag reports, because the anchor decides where the card sits.
 *
 * The start rect is read from the store rather than the subscribed size, so a drag
 * begins from what the card is now even if another card resized it since this render.
 */
export function useRefCardHandles(sides: ResizeSide[]): RefCardHandle[] {
  return useMemo(
    () =>
      sides.map((side) => {
        const handle = createResizeHandle({
          side,
          getRect: () => ({ x: 0, y: 0, ...useStore.getState().size }),
          onResize: ({ width, height }) => useStore.getState().setSize({ width, height }),
          minWidth: REF_CARD_MIN_SIZE.width,
          minHeight: REF_CARD_MIN_SIZE.height,
        })

        return { side, style: refCardHandleStyle(side), onPointerDown: handle.onPointerDown }
      }),
    [sides],
  )
}
