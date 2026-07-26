/**
 * Framework-neutral observable store. Holds a snapshot object, notifies
 * listeners on change, and preserves untouched nested references so selector
 * reads stay stable. React binds it through `useSyncExternalStore` and Vue binds
 * it through a composable, so both editors share one store implementation.
 */
export type StoreListener = () => void

export interface Store<T extends object> {
  getState: () => T
  setState: (partial: Partial<T> | ((prev: T) => Partial<T>)) => void
  subscribe: (listener: StoreListener) => () => void
}

export function createStore<T extends object>(initial: T): Store<T> {
  let state = initial
  const listeners = new Set<StoreListener>()

  function getState(): T {
    return state
  }

  function setState(
    partial: Partial<T> | ((prev: T) => Partial<T>),
  ): void {
    const patch = typeof partial === "function" ? partial(state) : partial
    let changed = false
    for (const key in patch) {
      if (patch[key] !== state[key]) {
        changed = true
        break
      }
    }
    if (!changed) return
    state = { ...state, ...patch }
    for (const listener of listeners) listener()
  }

  function subscribe(listener: StoreListener): () => void {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  return { getState, setState, subscribe }
}
