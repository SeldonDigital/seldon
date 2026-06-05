import { create } from "zustand"
import type { NodeRect } from "../tracking/hooks/use-node-rects-store"

/**
 * Canvas-relative rects for the single hover and selection outlines. Written by
 * `CanvasOverlayTracker` (which can read the pan/zoom transform) and read by the
 * outline overlays, so the overlays stay glued during pan, zoom, and scroll.
 */
interface CanvasOverlayState {
  hoverRect: NodeRect | null
  selectionRect: NodeRect | null
  setHoverRect: (rect: NodeRect | null) => void
  setSelectionRect: (rect: NodeRect | null) => void
}

export const useCanvasOverlayStore = create<CanvasOverlayState>((set) => ({
  hoverRect: null,
  selectionRect: null,
  setHoverRect: (hoverRect) => set({ hoverRect }),
  setSelectionRect: (selectionRect) => set({ selectionRect }),
}))
