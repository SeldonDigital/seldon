import { useMemo } from "react"

import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { nodeRelationshipService } from "@seldon/core/workspace/services"

import { useSelection } from "./use-selection"
import { useWorkspace } from "./use-workspace"

export function useActiveBoard() {
  const {
    selection,
    selectedResourceEntry,
    selectedResourceItemKey,
    workspaceSelected,
    frozenBoardKey,
  } = useSelection()
  const { workspace } = useWorkspace()

  return {
    activeBoard: useMemo(() => {
      // Selecting the workspace (the objects-sidebar project row) clears the
      // node and board selection but must not switch the canvas. The board it
      // was showing is held in `frozenBoardKey`, so keep rendering that.
      if (workspaceSelected) {
        return frozenBoardKey
          ? (workspace.boards[frozenBoardKey] ?? null)
          : null
      }

      if (selection) {
        if (isBoard(selection)) return selection
        return nodeRelationshipService.findBoardForNode(selection, workspace)
      }

      // Selecting a resource board variant entry (theme, font collection, icon
      // set, or media) keeps its board active so the canvas keeps rendering it
      // and the auto-select-first-board effect does not fire.
      if (selectedResourceEntry) {
        return (
          Object.values(workspace.boards).find((entry) =>
            (entry as { variants?: { id: string }[] }).variants?.some(
              (variant) => variant.id === selectedResourceEntry.id,
            ),
          ) ?? null
        )
      }

      // Selecting a resource item (a font family or icon row) keeps its board
      // active. The key is `${resource}:${boardKey}:${entryId}:${slot}`.
      if (selectedResourceItemKey) {
        const boardKey = selectedResourceItemKey.split(":")[1]
        return boardKey ? (workspace.boards[boardKey] ?? null) : null
      }

      return null
    }, [
      selection,
      selectedResourceEntry,
      selectedResourceItemKey,
      workspaceSelected,
      frozenBoardKey,
      workspace,
    ]),
  }
}
