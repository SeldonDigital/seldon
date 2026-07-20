import type { Board } from "@seldon/core"
import type { BoardKey } from "@seldon/core/workspace/types"
import {
  findComponentForNode,
} from "@seldon/editor/lib/workspace/node-tree"
import {
  getComponentKey,
  getNode,
} from "@seldon/editor/lib/workspace/workspace-accessors"
import { useSelectionStore } from "@app/workspace/selection-store"
import { useWorkspace } from "@app/workspace/use-workspace"
import { storeToRefs } from "pinia"
import { computed, type ComputedRef } from "vue"

type BoardVariants = { variants?: { id: string }[] }

/**
 * Resolves the single board the canvas renders, mirroring the React
 * `useActiveBoard`. The active board follows the current selection: a selected
 * board or the board owning a selected node, a resource entry or resource item's
 * board, or the frozen board held while the workspace row is selected.
 */
export function useActiveBoard(): {
  activeBoardKey: ComputedRef<BoardKey | null>
  activeBoard: ComputedRef<Board | null>
} {
  const selection = useSelectionStore()
  const { workspace } = useWorkspace()
  const {
    selectedBoardId,
    selectedNodeId,
    selectedResourceEntry,
    selectedResourceItemKey,
    workspaceSelected,
    frozenBoardKey,
  } = storeToRefs(selection)

  const activeBoardKey = computed<BoardKey | null>(() => {
    const ws = workspace.value

    // Selecting the workspace row clears node and board selection but must not
    // switch the canvas. Keep rendering the board held in `frozenBoardKey`.
    if (workspaceSelected.value) {
      return frozenBoardKey.value && ws.boards[frozenBoardKey.value]
        ? frozenBoardKey.value
        : null
    }

    if (selectedBoardId.value) {
      return ws.boards[selectedBoardId.value] ? selectedBoardId.value : null
    }

    if (selectedNodeId.value) {
      const node = getNode(ws, selectedNodeId.value)
      if (!node) return null
      const board = findComponentForNode(node, ws)
      return board ? getComponentKey(board) : null
    }

    // A selected resource entry (theme, font collection, icon set, media) keeps
    // its board active so the canvas keeps rendering it.
    if (selectedResourceEntry.value) {
      const entryId = selectedResourceEntry.value.id
      const match = Object.entries(ws.boards).find(([, board]) =>
        (board as BoardVariants).variants?.some(
          (variant) => variant.id === entryId,
        ),
      )
      return match ? (match[0] as BoardKey) : null
    }

    // A selected resource item keys as `${resource}:${boardKey}:${entryId}:${slot}`.
    if (selectedResourceItemKey.value) {
      const boardKey = selectedResourceItemKey.value.split(":")[1]
      return boardKey && ws.boards[boardKey] ? (boardKey as BoardKey) : null
    }

    return null
  })

  const activeBoard = computed<Board | null>(() => {
    const key = activeBoardKey.value
    return key ? ((workspace.value.boards[key] as Board) ?? null) : null
  })

  return { activeBoardKey, activeBoard }
}
