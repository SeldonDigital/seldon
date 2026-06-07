import { produce } from "immer"
import { rules } from "../../../../rules/config/rules.config"
import {
  getComponentOrder,
  setComponentOrder,
} from "../../../helpers/components/component-sort-order"
import { workspacePropagationService } from "../../../services"
import type { ComponentEntry, ComponentKey } from "../../../types"
import { ExtractPayload, Workspace } from "../../../types"

export function reorderBoard(
  payload: ExtractPayload<"reorder_board">,
  workspace: Workspace,
) {
  if (rules.mutations.reorder.board.allowed === false) {
    return workspace
  }

  return produce(workspace, (draft) => {
    const { componentKey, newIndex } = payload

    const boardEntries = Object.entries(draft.components) as [
      ComponentKey,
      ComponentEntry,
    ][]

    if (newIndex < 0 || newIndex > boardEntries.length) {
      return draft
    }

    const boardToMove = draft.components[componentKey]
    if (!boardToMove) return draft

    const movingUp = getComponentOrder(boardToMove) < newIndex
    const targetIndex = movingUp ? newIndex - 1 : newIndex

    const sortedBoards = boardEntries
      .filter(([id]) => id !== componentKey)
      .sort((a, b) => getComponentOrder(a[1]) - getComponentOrder(b[1]))
      .map(([id]) => id)

    sortedBoards.splice(targetIndex, 0, componentKey)

    sortedBoards.forEach((id, index) => {
      const board = draft.components[id]
      if (!board) return
      setComponentOrder(board, index)
    })

    const updatedWorkspace = workspacePropagationService.realignComponentOrder(draft)
    Object.assign(draft.components, updatedWorkspace.components)

    return draft
  })
}
