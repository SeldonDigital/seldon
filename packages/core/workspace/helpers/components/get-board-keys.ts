import type { Board, BoardKey, Workspace } from "../../types"

/**
 * Finds the key for this board in workspace.boards.
 * Matches the board by reference against each map entry.
 *
 * Returns null when no entry is this same board instance.
 *
 * @param workspace Workspace that holds the boards map.
 * @param board Board instance to resolve.
 */
export function getBoardKey(
  workspace: Workspace,
  board: Board,
): BoardKey | null {
  for (const [boardKey, entry] of Object.entries(workspace.boards)) {
    if (entry === board) {
      return boardKey as BoardKey
    }
  }
  return null
}
