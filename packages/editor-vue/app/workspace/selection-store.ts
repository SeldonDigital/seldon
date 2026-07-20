import { defineStore } from "pinia"
import { computed, ref } from "vue"

import type { InstanceId, VariantId } from "@seldon/core"
import type { BoardKey } from "@seldon/core/workspace/types"

export type ResourceEntryKind = "theme" | "fontCollection" | "iconSet" | "media"
export type SelectedResourceEntry = { kind: ResourceEntryKind; id: string }

/**
 * Selection state store, mirroring the React selection store's fields and
 * mutually-exclusive setters. Each setter clears the other selection channels.
 * Navigation side effects (section/object auto-expansion) are layered by the
 * objects sidebar; this store owns the pure selection state.
 */
export const useSelectionStore = defineStore("selection", () => {
  const selectedBoardId = ref<BoardKey | null>(null)
  const selectedNodeId = ref<VariantId | InstanceId | null>(null)
  const selectedNodeRootId = ref<string | null>(null)
  const selectedResourceEntry = ref<SelectedResourceEntry | null>(null)
  const selectedResourceItemKey = ref<string | null>(null)
  const workspaceSelected = ref(false)
  const frozenBoardKey = ref<BoardKey | null>(null)

  const selectedId = computed(
    () =>
      selectedNodeId.value ??
      selectedBoardId.value ??
      selectedResourceEntry.value?.id ??
      null,
  )

  function clearAll(): void {
    selectedBoardId.value = null
    selectedNodeId.value = null
    selectedNodeRootId.value = null
    selectedResourceEntry.value = null
    selectedResourceItemKey.value = null
    workspaceSelected.value = false
    frozenBoardKey.value = null
  }

  function selectBoard(id: BoardKey | null): void {
    clearAll()
    selectedBoardId.value = id
  }

  function selectNode(
    id: VariantId | InstanceId | null,
    rootId: string | null = null,
  ): void {
    clearAll()
    selectedNodeId.value = id
    selectedNodeRootId.value = id ? rootId : null
  }

  function selectResourceEntry(
    kind: ResourceEntryKind,
    id: string | null,
  ): void {
    clearAll()
    selectedResourceEntry.value = id ? { kind, id } : null
  }

  function selectResourceItem(key: string | null): void {
    clearAll()
    selectedResourceItemKey.value = key
  }

  function selectWorkspace(frozen: BoardKey | null): void {
    clearAll()
    workspaceSelected.value = true
    frozenBoardKey.value = frozen
  }

  return {
    selectedBoardId,
    selectedNodeId,
    selectedNodeRootId,
    selectedResourceEntry,
    selectedResourceItemKey,
    workspaceSelected,
    frozenBoardKey,
    selectedId,
    selectBoard,
    selectNode,
    selectResourceEntry,
    selectResourceItem,
    selectWorkspace,
  }
})
