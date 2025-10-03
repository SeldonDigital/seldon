import {
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
  invariant,
} from "../../index"
import { ErrorMessages } from "../constants"

/**
 * Retrieves a node (variant or instance) by its ID from the workspace.
 * @param targetId - The ID of the node to retrieve
 * @param workspace - The workspace containing the nodes
 * @returns The node with the specified ID
 * @throws Error if the node is not found
 */
export function getNodeById(
  targetId: InstanceId | VariantId,
  workspace: Workspace,
): Variant | Instance {
  const node = workspace.byId[targetId]
  invariant(node, ErrorMessages.nodeNotFound(targetId))
  return node
}
