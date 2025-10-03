import { produce } from "immer"
import { ComponentId } from "../../../../components/constants"
import { rules } from "../../../../rules/config/rules.config"
import { workspaceService } from "../../../services/workspace.service"
import { Board } from "../../../types"
import { ExtractPayload, Workspace } from "../../../types"

export function handleReorderBoard(
  payload: ExtractPayload<"reorder_board">,
  workspace: Workspace,
) {
  if (rules.mutations.reorder.board.allowed === false) {
    return workspace
  }

  return produce(workspace, (draft) => {
    const { componentId, newIndex } = payload

    // Get all boards and sort them by index
    const boardEntries = Object.entries(draft.boards) as [ComponentId, Board][]

    // Validate the newIndex is within bounds
    if (newIndex < 0 || newIndex > boardEntries.length) {
      return draft
    }

    // Find the board being moved
    const boardToMove = draft.boards[componentId]
    if (!boardToMove) return draft

    // Determine the target index
    const movingUp = boardToMove.order! < newIndex
    const targetIndex = movingUp ? newIndex - 1 : newIndex

    // Create a sorted array of all boards except the one being moved
    const sortedBoards = boardEntries
      .filter(([id]) => id !== componentId)
      .sort((a, b) => a[1].order - b[1].order)
      .map(([id]) => id)

    // Insert the board at the new position
    sortedBoards.splice(targetIndex, 0, componentId)

    // Update all indices to match their position in the array
    sortedBoards.forEach((id, index) => {
      const board = draft.boards[id]
      if (!board) return
      board.order = index
    })

    // Realign the order of the boards based on component levels
    const updatedWorkspace = workspaceService.realignBoardOrder(draft)
    Object.assign(draft.boards, updatedWorkspace.boards)

    return draft
  })
}
