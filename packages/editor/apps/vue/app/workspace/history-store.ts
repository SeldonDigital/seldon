import { useDirtyStore } from "@app/persistence/dirty-store"
import { defineStore } from "pinia"
import { computed, shallowRef } from "vue"

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

/**
 * Undo/redo history of committed workspace revisions. Mirrors the React history
 * store: `push` truncates any redo tail and appends, capping the stack; `undo`
 * and `redo` move the index; `reset` replaces the stack with a single revision.
 */
export const useHistoryStore = defineStore("history", () => {
  // Workspaces are immutable snapshots produced by the core reducer (Immer,
  // auto-freeze on). A deep `ref` would make Vue proxy these frozen graphs,
  // which breaks the JS Proxy invariant when frozen array elements are read
  // back and also corrupts Immer if a proxied workspace is fed into `produce`.
  // A `shallowRef` keeps each snapshot raw; reactivity still fires because every
  // dispatch replaces the whole array by reference.
  const history = shallowRef<Workspace[]>([INITIAL_WORKSPACE])
  const currentIndex = shallowRef(0)

  const current = computed(() => history.value[currentIndex.value])
  const canUndo = computed(() => currentIndex.value > 0)
  const canRedo = computed(() => currentIndex.value < history.value.length - 1)

  function push(workspace: Workspace): void {
    const next = history.value.slice(0, currentIndex.value + 1)

    next.push(workspace)

    const trimmed = trimHistory(next)

    history.value = trimmed
    currentIndex.value = trimmed.length - 1
  }

  function undo(): void {
    if (currentIndex.value > 0) {
      currentIndex.value -= 1
      useDirtyStore().setDirty(true)
    }
  }

  function redo(): void {
    if (currentIndex.value < history.value.length - 1) {
      currentIndex.value += 1
      useDirtyStore().setDirty(true)
    }
  }

  function reset(state: Workspace): void {
    history.value = [state]
    currentIndex.value = 0
    useDirtyStore().setDirty(false)
  }

  return {
    history,
    currentIndex,
    current,
    canUndo,
    canRedo,
    push,
    undo,
    redo,
    reset,
  }
})

/**
 * Reads the current committed workspace without a component subscription, for
 * event handlers and command callbacks that need the latest workspace at call
 * time. Requires an active Pinia instance.
 */
export function getCurrentWorkspace(): Workspace {
  const store = useHistoryStore()

  return store.current
}
