import { Instance, InstanceId, Workspace, invariant } from "../../index"
import { ErrorMessages } from "../constants"
import { isVariantNode } from "./is-variant-node"

/**
 * Retrieves a child instance node by its ID, ensuring it's not a variant.
 * @param targetId - The ID of the child node to retrieve
 * @param workspace - The workspace containing the nodes
 * @returns The child instance node
 * @throws Error if the node is not found or is a variant instead of an instance
 */
export function getChildNodeById(
  targetId: InstanceId,
  workspace: Workspace,
): Instance {
  const node = workspace.byId[targetId]
  invariant(node, ErrorMessages.nodeNotFound(targetId))

  if (isVariantNode(node)) {
    throw new Error(ErrorMessages.nodeNotInstance(targetId))
  }
  return node
}
