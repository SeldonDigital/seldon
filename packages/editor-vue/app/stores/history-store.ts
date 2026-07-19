import { createEmptyWorkspace } from "@seldon/core"
import type { Workspace } from "@seldon/core/workspace/types"
import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { useDirtyStore } from "./dirty-store"

const REVISION_LIMIT = 50

export const INITIAL_WORKSPACE: Workspace = createEmptyWorkspace()

/**
 * Undo/redo history of committed workspace revisions. Mirrors the React history
 * store: `push` truncates any redo tail and appends, capping the stack; `undo`
 * and `redo` move the index; `reset` replaces the stack with a single revision.
 */
export const useHistoryStore = defineStore("history", () => {
  const history = ref<Workspace[]>([INITIAL_WORKSPACE])
  const currentIndex = ref(0)

  const current = computed(() => history.value[currentIndex.value])
  const canUndo = computed(() => currentIndex.value > 0)
  const canRedo = computed(() => currentIndex.value < history.value.length - 1)

  function push(workspace: Workspace): void {
    const next = history.value.slice(0, currentIndex.value + 1)
    next.push(workspace)
    if (next.length > REVISION_LIMIT) next.shift()
    history.value = next
    currentIndex.value = next.length - 1
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

  return { history, currentIndex, current, canUndo, canRedo, push, undo, redo, reset }
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
