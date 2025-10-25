import { useCallback, useEffect } from "react"
import { create } from "zustand"
import { useShallow } from "zustand/react/shallow"
import { Workspace } from "@seldon/core"
import customTheme from "@seldon/core/themes/custom"
import { CURRENT_WORKSPACE_VERSION } from "@seldon/core/workspace/middleware/migration/middleware"

const REVISION_LIMIT = 50

interface HistoryState {
  history: Workspace[]
  currentIndex: number
  push: (workspace: Workspace) => void
  undo: () => void
  redo: () => void
  reset: (state: Workspace) => void
}

export const INITIAL_WORKSPACE: Workspace = {
  version: CURRENT_WORKSPACE_VERSION,
  customTheme,
  boards: {},
  byId: {},
}

export const useStore = create<HistoryState>()((set) => ({
  history: [INITIAL_WORKSPACE],
  currentIndex: 0,

  push: (workspace: Workspace) =>
    set((store) => {
      // Remove any future states if we're not at the end
      const newHistory = store.history.slice(0, store.currentIndex + 1)
      // Add new state
      newHistory.push(workspace)
      // Limit history size
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

export function useHistory() {
  const { push, undo, redo, reset: storeReset } = useStore()
  const current = useStore(
    useShallow((state) => state.history[state.currentIndex]),
  )

  // Expose the current workspace to the window object so
  // that we can read from it in Cypress tests
  useEffect(() => {
    if (window.Cypress) {
      window.workspace = current
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
