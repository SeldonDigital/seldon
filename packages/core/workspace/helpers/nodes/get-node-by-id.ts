import { invariant } from "../../../index"
import { ErrorMessages } from "../../constants"
import { EntryNode, EntryNodeId, Workspace } from "../../types"

/**
 * Retrieves a node (variant or instance) by its ID from the workspace.
 * @param targetId - The ID of the node to retrieve
 * @param workspace - The workspace containing the nodes
 * @returns The node with the specified ID
 * @throws Error if the node is not found
 */
export function getNodeById(
  targetId: EntryNodeId,
  workspace: Workspace,
): EntryNode {
  const node = workspace.nodes[targetId]
  invariant(node, ErrorMessages.nodeNotFound(targetId))
  return node
}
