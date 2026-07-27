import {
  type CanvasRemeasureState,
  bumpRemeasure,
  remeasureStore,
  setTransforming,
} from "@seldon/editor/lib/canvas/remeasure/remeasure-store"

import { useSharedStore } from "./use-shared-store"

/** React binding for the shared canvas remeasure signal store. */
export function useCanvasRemeasureStore<S>(
  selector: (state: CanvasRemeasureState) => S,
): S {
  return useSharedStore(remeasureStore, selector)
}

export { bumpRemeasure, remeasureStore, setTransforming }
