import { create } from "zustand"
import type { OutlineColors } from "../../tracking/helpers/resolve-outline-surface"
import type { NodeRect } from "../../tracking/hooks/use-node-rects-store"

/**
 * Canvas-relative rects for the single hover and selection outlines. Written by
 * `CanvasOverlayTracker` (which can read the pan/zoom transform) and read by the
 * outline overlays, so the overlays stay glued during pan, zoom, and scroll.
 */
interface CanvasOverlayState {
  hoverRect: NodeRect | null
  selectionRect: NodeRect | null
  hoverOutlineColors: OutlineColors | null
  selectionOutlineColors: OutlineColors | null
  setHoverRect: (rect: NodeRect | null) => void
  setSelectionRect: (rect: NodeRect | null) => void
  setHoverOutlineColors: (colors: OutlineColors | null) => void
  setSelectionOutlineColors: (colors: OutlineColors | null) => void
}

export const useCanvasOverlayStore = create<CanvasOverlayState>((set) => ({
  hoverRect: null,
  selectionRect: null,
  hoverOutlineColors: null,
  selectionOutlineColors: null,
  setHoverRect: (hoverRect) => set({ hoverRect }),
  setSelectionRect: (selectionRect) => set({ selectionRect }),
  setHoverOutlineColors: (hoverOutlineColors) => set({ hoverOutlineColors }),
  setSelectionOutlineColors: (selectionOutlineColors) =>
    set({ selectionOutlineColors }),
}))

export type { OutlineColors }
