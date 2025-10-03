import { ComponentId } from "../../components/constants"
import { invariant } from "../../index"
import { ErrorMessages } from "../constants"
import { Board, Workspace } from "../types"

/**
 * Retrieves a board by its component ID from the workspace.
 * @param componentId - The component ID of the board to retrieve
 * @param workspace - The workspace containing the boards
 * @returns The board with the specified component ID
 * @throws Error if the board is not found
 */
export function getBoardById(
  componentId: ComponentId,
  workspace: Workspace,
): Board {
  const board = workspace.boards[componentId]
  invariant(board, ErrorMessages.boardNotFound(componentId))
  return board
}
