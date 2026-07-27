import type { Store } from "@seldon/editor/lib/canvas/store/observable"
import { type Ref, onScopeDispose, ref } from "vue"

/**
 * Binds a framework-neutral shared store to a Vue ref. The ref updates whenever
 * the selected slice changes and the subscription is cleaned up with the current
 * effect scope, mirroring the React `useSharedStore` binding.
 */
export function useSharedStore<T extends object, S>(
  store: Store<T>,
  selector: (state: T) => S,
): Ref<S> {
  const value = ref(selector(store.getState())) as Ref<S>
  const unsubscribe = store.subscribe(() => {
    value.value = selector(store.getState())
  })
  onScopeDispose(unsubscribe)
  return value
}
