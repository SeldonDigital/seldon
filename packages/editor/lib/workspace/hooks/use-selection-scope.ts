import type { SelectionScope } from "@seldon/ai"
import type { InstanceId, VariantId } from "@seldon/core/index"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { typeCheckingService } from "@seldon/core/workspace/services"
import type { BoardKey, Workspace } from "@seldon/core/workspace/types"
import { getComponent, getNode } from "@lib/workspace/workspace-accessors"
import { getCurrentWorkspace } from "./use-history"
import {
  type SelectedResourceEntry,
  useStore as useSelectionStore,
} from "./use-selection"
import { useWorkspace } from "./use-workspace"

export type { SelectionScope }

/** The raw selection fields a scope is classified from. */
interface SelectionSnapshot {
  selectedNodeId: VariantId | InstanceId | null
  selectedBoardId: BoardKey | null
  selectedResourceEntry: SelectedResourceEntry | null
  selectedResourceItemKey: string | null
  workspaceSelected: boolean
}

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
 * Classifies a selection snapshot into a {@link SelectionScope}. Pure so the
 * reactive hook and the non-hook readers share one rule. Empty selection and an
 * explicit workspace selection both resolve to `workspace`.
 */
export function resolveSelectionScope(
  snapshot: SelectionSnapshot,
  workspace: Workspace,
): SelectionScope {
  const {
    selectedNodeId,
    selectedBoardId,
    selectedResourceEntry,
    selectedResourceItemKey,
    workspaceSelected,
  } = snapshot

  if (workspaceSelected) return "workspace"

  if (selectedNodeId) {
    const node = getNode(workspace, selectedNodeId)
    if (node && typeCheckingService.isInstance(node)) return "instance"
    return "variant"
  }

  if (selectedBoardId) {
    const board = getComponent(workspace, selectedBoardId)
    if (board) {
      if (isThemeBoard(board)) return "theme"
      if (isFontCollectionBoard(board)) return "fontCollection"
      if (isIconSetBoard(board)) return "iconSet"
      if (isMediaBoard(board)) return "media"
    }
    return "board"
  }

  if (selectedResourceEntry) {
    switch (selectedResourceEntry.kind) {
      case "theme":
        return "theme"
      case "fontCollection":
        return "fontCollection"
      case "iconSet":
        return "iconSet"
      case "media":
        return "media"
    }
  }

  if (selectedResourceItemKey) {
    const resource = selectedResourceItemKey.split(":")[0]
    if (resource === "font-collection") return "fontCollection"
    if (resource === "icon-set") return "iconSet"
    if (resource === "media") return "media"
  }

  return "workspace"
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
