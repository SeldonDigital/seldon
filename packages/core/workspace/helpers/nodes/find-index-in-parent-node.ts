import { EntryNode, EntryNodeId, Workspace } from "../../types"
import { findBoardByTreeNodeId } from "../components/find-board-by-tree-node-id"
import { getComponentTreeChildIds } from "../components/get-component-tree-child-ids"

/**
 * Finds the index position of a child node within its parent's children array.
 * @param parent - The parent node to search within
 * @param childIdToCompare - The ID of the child node to find
 * @returns The index of the child, or -1 if not found or parent has no children
 */
export function findIndexInParentNode(
  parent: EntryNode | null,
  childIdToCompare: string,
  workspace: Workspace,
) {
  if (!parent) return -1
  const board = findBoardByTreeNodeId(workspace, parent.id)
  if (!board) return -1
  return getComponentTreeChildIds(board, parent.id).indexOf(
    childIdToCompare as EntryNodeId,
  )
}
