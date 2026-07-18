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
import { getComponent, getNode } from "./workspace-accessors"
import type { ResourceEntryKind } from "./selection-kind"

export type { SelectionScope }

/** A resource-entry selection, framework neutral. */
export type SelectionSnapshotResourceEntry = {
  kind: ResourceEntryKind
  id: string
}

/** The raw selection fields a scope is classified from. */
export interface SelectionSnapshot {
  selectedNodeId: VariantId | InstanceId | null
  selectedBoardId: BoardKey | null
  selectedResourceEntry: SelectionSnapshotResourceEntry | null
  selectedResourceItemKey: string | null
  workspaceSelected: boolean
}

/**
 * Classifies a selection snapshot into a {@link SelectionScope}. Pure so both
 * editors and every non-hook reader share one rule. Empty selection and an
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
