import { produce } from "immer"
import { rules } from "../../../../rules/config/rules.config"
import {
  getBoardOrder,
  setBoardOrder,
} from "../../../helpers/components/board-sort-order"
import { workspacePropagationService } from "../../../services"
import type { Board, BoardKey } from "../../../types"
import { ExtractPayload, Workspace } from "../../../types"

export function reorderBoard(
  payload: ExtractPayload<"reorder_board">,
  workspace: Workspace,
) {
  if (rules.mutations.reorder.board.allowed === false) {
    return workspace
  }

  return produce(workspace, (draft) => {
    const { boardKey, newIndex } = payload

    const boardEntries = Object.entries(draft.components) as [
      BoardKey,
      Board,
    ][]

    if (newIndex < 0 || newIndex > boardEntries.length) {
      return draft
    }

    const boardToMove = draft.components[boardKey]
    if (!boardToMove) return draft

    const movingUp = getBoardOrder(boardToMove) < newIndex
    const targetIndex = movingUp ? newIndex - 1 : newIndex

    const sortedBoards = boardEntries
      .filter(([id]) => id !== boardKey)
      .sort((a, b) => getBoardOrder(a[1]) - getBoardOrder(b[1]))
      .map(([id]) => id)

    sortedBoards.splice(targetIndex, 0, boardKey)

    sortedBoards.forEach((id, index) => {
      const board = draft.components[id]
      if (!board) return
      setBoardOrder(board, index)
    })

    const updatedWorkspace = workspacePropagationService.realignBoardOrder(draft)
    Object.assign(draft.components, updatedWorkspace.components)

    return draft
  })
}
