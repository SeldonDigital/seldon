import type { Board, BoardKey, Workspace } from "../../types"

/**
 * Lists every board key in workspace.components.
 *
 * @param workspace Workspace that holds the boards map.
 */
export function getBoardKeys(workspace: Workspace): BoardKey[] {
  return Object.keys(workspace.components) as BoardKey[]
}

/**
 * Finds the key for this board in workspace.components.
 * Matches the board by reference against each map entry.
 *
 * Returns null when no entry is this same board instance.
 *
 * @param workspace Workspace that holds the boards map.
 * @param board Board instance to resolve.
 */
export function getBoardKey(workspace: Workspace, board: Board): BoardKey | null {
  for (const [boardKey, entry] of Object.entries(workspace.components)) {
    if (entry === board) {
      return boardKey as BoardKey
    }
  }
  return null
}
