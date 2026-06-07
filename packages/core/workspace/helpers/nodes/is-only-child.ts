import { invariant } from "../../../index"
import { EntryNodeId, Workspace } from "../../types"
import { findBoardByTreeNodeId } from "../components/find-board-by-tree-node-id"
import { getComponentTreeChildIds } from "../components/get-component-tree-child-ids"
import { findParentNode } from "./find-parent-node"

/**
 * Check if a child is the only child of a parent
 *
 * @param childId - The child to check
 * @param workspace - The workspace
 */
export function isOnlyChild(childId: EntryNodeId, workspace: Workspace) {
  const parent = findParentNode(childId, workspace)
  invariant(parent, "Unable to find parent for child " + childId)
  const board = findBoardByTreeNodeId(workspace, parent.id)
  const childIds = board ? getComponentTreeChildIds(board, parent.id) : []
  return childIds.length === 1
}
