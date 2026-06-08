import { create } from "zustand"

/**
 * A monotonic signal bumped once a canvas reorder glide settles. The overlay
 * and node-rect trackers re-measure when `version` changes, so the selection,
 * hover, and wireframe outlines snap to a node's final position after a FLIP
 * animation instead of staying at the pre-animation spot until the next click.
 */
interface CanvasRemeasureState {
  version: number
  bump: () => void
}

export const useCanvasRemeasureStore = create<CanvasRemeasureState>((set) => ({
  version: 0,
  bump: () => set((state) => ({ version: state.version + 1 })),
}))
