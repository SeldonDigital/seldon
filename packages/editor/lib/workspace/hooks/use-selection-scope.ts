import {
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { typeCheckingService } from "@seldon/core/workspace/services"
import { getComponent, getNode } from "@lib/workspace/workspace-accessors"
import { useStore as useSelectionStore } from "./use-selection"
import { useWorkspace } from "./use-workspace"

/**
 * The scope the next Hari turn resolves against, one of the eight selection
 * kinds surfaced by the objects sidebar. It mirrors what the harness is
 * expected to act on: broad for the workspace, cascading for a board, global
 * for a variant, local for an instance, and token- or asset-scoped for the
 * resource boards.
 */
export type SelectionScope =
  | "workspace"
  | "board"
  | "variant"
  | "instance"
  | "theme"
  | "fontCollection"
  | "iconSet"
  | "media"

/**
 * Classifies the current selection into a {@link SelectionScope}. Reads the
 * selection store and the current workspace so it can tell a variant node from
 * an instance and a component board from a resource board. Empty selection and
 * an explicit workspace selection both resolve to `workspace`.
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
  const workspaceSelected = useSelectionStore((state) => state.workspaceSelected)
  const { workspace } = useWorkspace()

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
