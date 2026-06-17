import { EntryNode, Workspace } from "../../types"
import { getBoardByNodeId } from "../components/get-board-by-node-id"
import { isResourceType } from "../components/is-resource-type"

/**
 * Checks if a variant belongs to a special board (IconSet, Theme, or Assembly).
 *
 * @param variant - The variant to check
 * @param workspace - The workspace containing the board
 * @returns True if the variant belongs to a special board
 */
export function isSpecialBoardVariant(
  variant: EntryNode,
  workspace: Workspace,
): boolean {
  const board = getBoardByNodeId(workspace, variant.id)
  if (!board) {
    return false
  }

  return isResourceType(board)
}
