import { createStore } from "../store/observable"

/**
 * A monotonic signal bumped once a canvas reorder glide or a pan/zoom settles.
 * The overlay and node-rect trackers re-measure when `version` changes, so the
 * selection, hover, and wireframe outlines snap to a node's final position.
 *
 * `isTransforming` is true while a pan or zoom is in flight. Wireframe boxes
 * hide while it is true and redraw once it clears, so they do not lag behind the
 * moving canvas.
 */
export interface CanvasRemeasureState {
  version: number
  isTransforming: boolean
}

export const remeasureStore = createStore<CanvasRemeasureState>({
  version: 0,
  isTransforming: false,
})

export function bumpRemeasure(): void {
  remeasureStore.setState((state) => ({ version: state.version + 1 }))
}

export function setTransforming(isTransforming: boolean): void {
  remeasureStore.setState({ isTransforming })
}
