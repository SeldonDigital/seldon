import type { NodeRect } from "@seldon/editor/lib/canvas/overlay/geometry"
import type { OutlineColors } from "@seldon/editor/lib/canvas/overlay/outline-colors"
import {
  type CanvasOverlayState,
  overlayStore,
} from "@seldon/editor/lib/canvas/overlay/overlay-store"

import { useSharedStore } from "./use-shared-store"

export type { OutlineColors, NodeRect }

/** React binding for the shared canvas overlay store (hover/selection rects). */
export function useCanvasOverlayStore<S>(
  selector: (state: CanvasOverlayState) => S,
): S {
  return useSharedStore(overlayStore, selector)
}
