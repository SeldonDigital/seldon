import { useCallback, useEffect } from "react"
import { create } from "zustand"
import { useShallow } from "zustand/react/shallow"

import { createEmptyWorkspace } from "@seldon/core"

import type { Workspace } from "@seldon/core/workspace/types"

/** Hard cap on retained revisions, regardless of size. */
const REVISION_LIMIT = 50

/** Always keep at least this many revisions so undo stays useful on large files. */
const MIN_REVISIONS = 10

/**
 * Memory budget for the undo stack, expressed as the total node entries retained
 * across all revisions. Node count is a cheap proxy for a revision's size, so a
 * large workspace keeps fewer revisions and the stack stays bounded, while a
 * small workspace keeps the full {@link REVISION_LIMIT}. Immer shares unchanged
 * sub-trees between revisions, so real memory is lower than this proxy implies.
 */
const HISTORY_NODE_BUDGET = 20_000

interface HistoryState {
  history: Workspace[]
  currentIndex: number
  push: (workspace: Workspace) => void
  undo: () => void
  redo: () => void
  reset: (state: Workspace) => void
}

export const INITIAL_WORKSPACE: Workspace = createEmptyWorkspace()

/**
 * Node count per workspace, memoized by the Immer-stable `nodes` reference so a
 * push does not re-scan every retained revision on each edit.
 */
const nodeCountCache = new WeakMap<object, number>()

function workspaceNodeCount(workspace: Workspace): number {
  const nodes = workspace.nodes as object
  const cached = nodeCountCache.get(nodes)

  if (cached !== undefined) return cached

  const count = Object.keys(workspace.nodes).length

  nodeCountCache.set(nodes, count)

  return count
}

/**
 * Trims the undo stack from the oldest end. A hard count cap runs first, then a
 * memory-aware pass drops the oldest revisions until the retained node total
 * fits {@link HISTORY_NODE_BUDGET}, never going below {@link MIN_REVISIONS}.
 */
function trimHistory(history: Workspace[]): Workspace[] {
  let trimmed =
    history.length > REVISION_LIMIT ? history.slice(history.length - REVISION_LIMIT) : history

  let total = trimmed.reduce((sum, workspace) => sum + workspaceNodeCount(workspace), 0)

  while (trimmed.length > MIN_REVISIONS && total > HISTORY_NODE_BUDGET) {
    total -= workspaceNodeCount(trimmed[0])
    trimmed = trimmed.slice(1)
  }

  return trimmed
}

export const useHistoryStore = create<HistoryState>()((set) => ({
  history: [INITIAL_WORKSPACE],
  currentIndex: 0,

  push: (workspace: Workspace) =>
    set((store) => {
      const nextHistory = store.history.slice(0, store.currentIndex + 1)

      nextHistory.push(workspace)

      const newHistory = trimHistory(nextHistory)

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
  const current = useHistoryStore(useShallow((state) => state.history[state.currentIndex]))

  useEffect(() => {
    if (typeof window !== "undefined" && (window as { Cypress?: unknown }).Cypress) {
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
