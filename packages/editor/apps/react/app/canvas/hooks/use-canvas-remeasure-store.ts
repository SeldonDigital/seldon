import {
  bumpRemeasure,
  remeasureStore,
  setTransforming,
} from "@seldon/editor/lib/canvas/remeasure/remeasure-store"

import { useSharedStore } from "./use-shared-store"

import type { CanvasRemeasureState } from "@seldon/editor/lib/canvas/remeasure/remeasure-store"

/** React binding for the shared canvas remeasure signal store. */
export function useCanvasRemeasureStore<S>(selector: (state: CanvasRemeasureState) => S): S {
  return useSharedStore(remeasureStore, selector)
}

export { bumpRemeasure, remeasureStore, setTransforming }
