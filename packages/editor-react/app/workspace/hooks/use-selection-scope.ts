import type { SelectionScope } from "@seldon/ai"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import type { Workspace } from "@seldon/core/workspace/types"
import { getComponent } from "@seldon/editor/lib/workspace/workspace-accessors"
import {
  type SelectionSnapshot,
  resolveSelectionScope,
} from "@seldon/editor/lib/workspace/selection-scope"
import { getCurrentWorkspace } from "./use-history"
import { useStore as useSelectionStore } from "./use-selection"
import { useWorkspace } from "./use-workspace"

export type { SelectionScope }
export { resolveSelectionScope }

/** Reads the current selection snapshot without subscribing to the store. */
function selectionSnapshot(): SelectionSnapshot {
  const state = useSelectionStore.getState()
  return {
    selectedNodeId: state.selectedNodeId,
    selectedBoardId: state.selectedBoardId,
    selectedResourceEntry: state.selectedResourceEntry,
    selectedResourceItemKey: state.selectedResourceItemKey,
    workspaceSelected: state.workspaceSelected,
  }
}

/**
 * Non-hook read of the current selection scope, for command and action
 * callbacks that need the live scope at call time. Pass the workspace the
 * selection resolves against; defaults to the committed workspace.
 */
export function getSelectionScope(
  workspace: Workspace = getCurrentWorkspace(),
): SelectionScope {
  return resolveSelectionScope(selectionSnapshot(), workspace)
}

/**
 * Non-hook read of the resource entry id to edit for a theme, font collection,
 * or icon set scope. Resolves from the selected resource entry, the entry id
 * embedded in a selected resource item key, or the default variant entry of a
 * selected resource board. Returns undefined for non-resource selections.
 */
export function getResourceTargetId(
  workspace: Workspace = getCurrentWorkspace(),
): string | undefined {
  const state = useSelectionStore.getState()

  if (state.selectedResourceEntry) return state.selectedResourceEntry.id

  if (state.selectedResourceItemKey) {
    // Key shape: `${resource}:${boardKey}:${entryId}:${slot}`.
    return state.selectedResourceItemKey.split(":")[2] || undefined
  }

  if (state.selectedBoardId) {
    const board = getComponent(workspace, state.selectedBoardId)
    if (
      board &&
      (isThemeBoard(board) ||
        isFontCollectionBoard(board) ||
        isIconSetBoard(board) ||
        isMediaBoard(board))
    ) {
      return board.variants[0]?.id
    }
  }

  return undefined
}

/**
 * Reactive classification of the current selection into a
 * {@link SelectionScope}, for the Hari basis chip. Subscribes to the selection
 * fields and the workspace so the chip updates as selection changes.
 */
export function useSelectionScope(): SelectionScope {
  const selectedNodeId = useSelectionStore((state) => state.selectedNodeId)
  const selectedBoardId = useSelectionStore((state) => state.selectedBoardId)
  const selectedResourceEntry = useSelectionStore(
    (state) => state.selectedResourceEntry,
  )
  const selectedResourceItemKey = useSelectionStore(
    (state) => state.selectedResourceItemKey,
  )
  const workspaceSelected = useSelectionStore(
    (state) => state.workspaceSelected,
  )
  const { workspace } = useWorkspace()

  return resolveSelectionScope(
    {
      selectedNodeId,
      selectedBoardId,
      selectedResourceEntry,
      selectedResourceItemKey,
      workspaceSelected,
    },
    workspace,
  )
}
