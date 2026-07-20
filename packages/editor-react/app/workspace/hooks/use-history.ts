import { useCallback, useEffect } from "react"
import { create } from "zustand"
import { useShallow } from "zustand/react/shallow"

import { createEmptyWorkspace } from "@seldon/core"
import type { Workspace } from "@seldon/core/workspace/types"

const REVISION_LIMIT = 50

interface HistoryState {
  history: Workspace[]
  currentIndex: number
  push: (workspace: Workspace) => void
  undo: () => void
  redo: () => void
  reset: (state: Workspace) => void
}

export const INITIAL_WORKSPACE: Workspace = createEmptyWorkspace()

export const useHistoryStore = create<HistoryState>()((set) => ({
  history: [INITIAL_WORKSPACE],
  currentIndex: 0,

  push: (workspace: Workspace) =>
    set((store) => {
      const newHistory = store.history.slice(0, store.currentIndex + 1)
      newHistory.push(workspace)
      if (newHistory.length > REVISION_LIMIT) {
        newHistory.shift()
      }
      return {
        history: newHistory,
        currentIndex: newHistory.length - 1,
      }
    }),

  undo: () =>
    set((store) => {
      if (store.currentIndex > 0) {
        return { currentIndex: store.currentIndex - 1 }
      }
      return store
    }),

  redo: () =>
    set((store) => {
      if (store.currentIndex < store.history.length - 1) {
        return { currentIndex: store.currentIndex + 1 }
      }
      return store
    }),

  reset: (state: Workspace) =>
    set(() => ({
      history: [state],
      currentIndex: 0,
    })),
}))

/**
 * Reads the current committed workspace without subscribing a component to the
 * history store. Use inside event handlers and command callbacks that need the
 * latest workspace at call time but must not re-render on every edit.
 */
export function getCurrentWorkspace(): Workspace {
  const { history, currentIndex } = useHistoryStore.getState()
  return history[currentIndex]
}

export function useHistory() {
  const push = useHistoryStore((state) => state.push)
  const undo = useHistoryStore((state) => state.undo)
  const redo = useHistoryStore((state) => state.redo)
  const storeReset = useHistoryStore((state) => state.reset)
  const current = useHistoryStore(
    useShallow((state) => state.history[state.currentIndex]),
  )

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window as { Cypress?: unknown }).Cypress
    ) {
      ;(window as { workspace?: Workspace }).workspace = current
    }
  }, [current])

  const reset = useCallback(
    (state: Workspace) => {
      storeReset(state)
    },
    [storeReset],
  )

  return { current, reset, push, undo, redo }
}
