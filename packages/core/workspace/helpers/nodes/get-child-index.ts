import { invariant } from "../../../index"
import { EntryNodeId, Workspace } from "../../types"
import { getBoardByNodeId } from "../components/get-board-by-node-id"
import { getChildrenIds } from "../components/get-children-ids"
import { findParentNode } from "./find-parent-node"

/**
 * Get the index of a child in its parent
 * @param childId - The ID of the child node
 * @param workspace - The current workspace state
 * @returns The index of the child in its parent
 */
export function getChildIndex(childId: EntryNodeId, workspace: Workspace) {
  const parent = findParentNode(childId, workspace)
  invariant(parent, "Parent not found for " + childId)

  const board = getBoardByNodeId(workspace, parent.id)
  const siblings = board ? getChildrenIds(board, parent.id) : []
  const index = siblings.indexOf(childId)
  invariant(index !== -1, "Unable to determine index for node " + childId)

  return index
}
