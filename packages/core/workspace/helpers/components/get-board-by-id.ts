import { invariant } from "../../../index"
import type { Board, BoardKey, Workspace } from "../../types"

/**
 * Looks up a board by its key in {@link Workspace.boards}.
 */
export function getBoardById(boardKey: BoardKey, workspace: Workspace): Board {
  const board = workspace.boards[boardKey]
  invariant(board, `Board ${boardKey} not found.`)
  return board
}
