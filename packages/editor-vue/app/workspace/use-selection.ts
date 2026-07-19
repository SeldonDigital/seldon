import { storeToRefs } from "pinia"
import { computed } from "vue"
import type { Instance, InstanceId, Variant, VariantId } from "@seldon/core"
import type { Board } from "@seldon/core/workspace/model/components"
import type { BoardKey } from "@seldon/core/workspace/types"
import {
  getComponent,
  getNode,
} from "@seldon/editor/lib/workspace/workspace-accessors"
import { useSelectionStore } from "@app/workspace/selection-store"
import { useWorkspace } from "@app/workspace/use-workspace"

/**
 * Preview-aware, derived selection. Exposes the raw selection state plus the
 * resolved selected node/board and per-kind resource entry ids, mirroring the
 * React `useSelection` read surface. Selection setters come from the selection
 * store; the objects sidebar layers navigation side effects (section/object
 * expansion) on top in a later stage.
 */
export function useSelection() {
  const selection = useSelectionStore()
  const {
    selectedBoardId,
    selectedNodeId,
    selectedNodeRootId,
    selectedResourceEntry,
    selectedResourceItemKey,
    workspaceSelected,
    frozenBoardKey,
  } = storeToRefs(selection)
  const { workspace } = useWorkspace()

  const selectedThemeEntryId = computed(() =>
    selectedResourceEntry.value?.kind === "theme"
      ? selectedResourceEntry.value.id
      : null,
  )
  const selectedFontCollectionEntryId = computed(() =>
    selectedResourceEntry.value?.kind === "fontCollection"
      ? selectedResourceEntry.value.id
      : null,
  )
  const selectedIconSetEntryId = computed(() =>
    selectedResourceEntry.value?.kind === "iconSet"
      ? selectedResourceEntry.value.id
      : null,
  )
  const selectedMediaEntryId = computed(() =>
    selectedResourceEntry.value?.kind === "media"
      ? selectedResourceEntry.value.id
      : null,
  )

  const selectedNode = computed<Variant | Instance | null>(() =>
    selectedNodeId.value
      ? (getNode(workspace.value, selectedNodeId.value) ?? null)
      : null,
  )
  const selectedBoard = computed<Board | null>(() =>
    selectedBoardId.value
      ? (getComponent(workspace.value, selectedBoardId.value) ?? null)
      : null,
  )
  const selectedItem = computed<Variant | Instance | Board | null>(
    () => selectedNode.value ?? selectedBoard.value,
  )
  const selectedId = computed(
    () =>
      selectedNodeId.value ??
      selectedBoardId.value ??
      selectedResourceEntry.value?.id ??
      null,
  )

  function selectBoard(id: BoardKey | null): void {
    selection.selectBoard(id)
  }
  function selectNode(
    id: VariantId | InstanceId | null,
    rootId: string | null = null,
  ): void {
    selection.selectNode(id, rootId)
  }

  return {
    selectBoard,
    selectNode,
    selectResourceEntry: selection.selectResourceEntry,
    selectResourceItem: selection.selectResourceItem,
    selectWorkspace: selection.selectWorkspace,
    selectedBoardId,
    selectedNodeId,
    selectedNodeRootId,
    selectedResourceEntry,
    selectedResourceItemKey,
    workspaceSelected,
    frozenBoardKey,
    selectedThemeEntryId,
    selectedFontCollectionEntryId,
    selectedIconSetEntryId,
    selectedMediaEntryId,
    selectedNode,
    selectedBoard,
    selectedItem,
    selectedId,
  }
}
