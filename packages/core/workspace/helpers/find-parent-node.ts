import { Instance, InstanceId, Variant, VariantId, Workspace } from "../types"
import { findParentNodeInNode } from "./find-parent-node-in-node"
import { getAllVariants } from "./get-all-variants"

/**
 * Finds the parent node of a child node by searching through all variants in the workspace.
 * @param nodeId - The ID of the child node to find the parent for
 * @param workspace - The workspace containing the nodes
 * @returns The parent node, or null if the node is not found or not a child
 */
export function findParentNode(
  nodeId: InstanceId | VariantId,
  workspace: Workspace,
): Variant | Instance | null {
  const node = workspace.byId[nodeId]

  if (!node) {
    return null
  }

  if (!node.isChild) {
    return null
  }

  const allVariants = getAllVariants(workspace)

  for (const variant of allVariants) {
    const found = findParentNodeInNode(nodeId as InstanceId, variant, workspace)
    if (found) return found
  }

  return null
}
