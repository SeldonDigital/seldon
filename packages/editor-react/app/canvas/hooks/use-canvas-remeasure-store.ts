import { create } from "zustand"

/**
 * A monotonic signal bumped once a canvas reorder glide or a pan/zoom settles.
 * The overlay and node-rect trackers re-measure when `version` changes, so the
 * selection, hover, and wireframe outlines snap to a node's final position
 * instead of staying at the pre-animation spot until the next click.
 *
 * `isTransforming` is true while a pan or zoom is in flight. Wireframe boxes
 * hide while it is true and redraw once it clears, so they do not lag behind the
 * moving canvas.
 */
interface CanvasRemeasureState {
  version: number
  isTransforming: boolean
  bump: () => void
  setTransforming: (isTransforming: boolean) => void
}

export const useCanvasRemeasureStore = create<CanvasRemeasureState>((set) => ({
  version: 0,
  isTransforming: false,
  bump: () => set((state) => ({ version: state.version + 1 })),
  setTransforming: (isTransforming) => set({ isTransforming }),
}))
