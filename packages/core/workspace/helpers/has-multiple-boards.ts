import { Workspace } from "../types"

/**
 * Check if a workspace has multiple boards
 *
 * @param workspace - The workspace
 */
export function hasMultipleBoards(workspace: Workspace) {
  return Object.keys(workspace.boards).length > 1
}
