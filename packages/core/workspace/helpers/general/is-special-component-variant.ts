import { EntryNode, Workspace } from "../../types"
import { findComponentByTreeNodeId } from "../components/find-component-by-tree-node-id"
import { isResourceType } from "../components/is-resource-type"

/**
 * Checks if a variant belongs to a special board (IconSet, Theme, or Assembly).
 *
 * @param variant - The variant to check
 * @param workspace - The workspace containing the board
 * @returns True if the variant belongs to a special board
 */
export function isSpecialComponentVariant(
  variant: EntryNode,
  workspace: Workspace,
): boolean {
  const board = findComponentByTreeNodeId(workspace, variant.id)
  if (!board) {
    return false
  }

  return isResourceType(board)
}
