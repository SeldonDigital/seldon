import { invariant } from "../../index"
import { ErrorMessages } from "../constants"
import { InstanceId, VariantId, Workspace } from "../types"
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
  parentId: InstanceId | VariantId,
  index: number,
  workspace: Workspace,
) {
  const parentNode = getNodeById(parentId, workspace)

  const nodeId = parentNode.children?.[index]
  invariant(nodeId, ErrorMessages.noChildAtIndex(parentId, index))

  return getNodeById(nodeId, workspace)
}
