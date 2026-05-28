import { invariant } from "../../../index"
import { ErrorMessages } from "../../constants"
import { EntryNodeId, Workspace } from "../../types"
import { findComponentByTreeNodeId } from "../components/find-component-by-tree-node-id"
import { getComponentTreeChildIds } from "../components/get-component-tree-child-ids"
import { getNodeById } from "./get-node-by-id"

/**
 * Finds a child node by its parent's ID and the child's index position.
 * @param parentId - The ID of the parent node
 * @param index - The index position of the child within the parent's children array
 * @param workspace - The workspace containing the nodes
 * @returns The child node at the specified index
 * @throws Error if no child exists at the given index
 */
export function findNodeByParentIdAndIndex(
  parentId: EntryNodeId,
  index: number,
  workspace: Workspace,
) {
  const board = findComponentByTreeNodeId(workspace, parentId)
  const nodeId = board ? getComponentTreeChildIds(board, parentId)[index] : undefined
  invariant(nodeId, ErrorMessages.noChildAtIndex(parentId, index))

  return getNodeById(nodeId, workspace)
}
