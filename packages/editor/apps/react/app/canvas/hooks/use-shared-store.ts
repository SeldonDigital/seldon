import { useSyncExternalStore } from "react"

import type { Store } from "@seldon/editor/lib/canvas/store/observable"

/**
 * Binds a framework-neutral shared store to React through `useSyncExternalStore`.
 * The returned hook takes a selector that must read stored references so the
 * snapshot stays stable between updates, matching the store's own change
 * detection. Imperative reads and writes use the underlying store methods.
 */
export function useSharedStore<T extends object, S>(store: Store<T>, selector: (state: T) => S): S {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()),
  )
}
