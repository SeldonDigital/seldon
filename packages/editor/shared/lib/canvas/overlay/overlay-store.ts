import { createStore } from "../store/observable"

import type { NodeRect } from "./geometry"
import type { OutlineColors } from "./outline-colors"

/**
 * Canvas-relative rects for the single hover and selection outlines, plus their
 * resolved border colors. Written by the overlay tracker and read by the outline
 * overlays, so the overlays stay glued during pan, zoom, and scroll.
 */
export interface CanvasOverlayState {
  hoverRect: NodeRect | null
  selectionRect: NodeRect | null
  hoverOutlineColors: OutlineColors | null
  selectionOutlineColors: OutlineColors | null
}

export const overlayStore = createStore<CanvasOverlayState>({
  hoverRect: null,
  selectionRect: null,
  hoverOutlineColors: null,
  selectionOutlineColors: null,
})

export function setHoverRect(hoverRect: NodeRect | null): void {
  overlayStore.setState({ hoverRect })
}

export function setSelectionRect(selectionRect: NodeRect | null): void {
  overlayStore.setState({ selectionRect })
}

export function setHoverOutlineColors(hoverOutlineColors: OutlineColors | null): void {
  overlayStore.setState({ hoverOutlineColors })
}

export function setSelectionOutlineColors(selectionOutlineColors: OutlineColors | null): void {
  overlayStore.setState({ selectionOutlineColors })
}
