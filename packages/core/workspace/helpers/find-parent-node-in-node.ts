import { Instance, InstanceId, Variant, Workspace } from "../../index"
import { canNodeHaveChildren } from "./can-node-have-children"

/**
 * Recursively searches for the parent node that contains a specific child ID.
 * @param childIdtoLookFor - The child ID to search for
 * @param node - The node to search within
 * @param workspace - The workspace containing the nodes
 * @returns The parent node containing the child, or null if not found
 */
export function findParentNodeInNode(
  childIdtoLookFor: InstanceId,
  node: Variant | Instance,
  workspace: Workspace,
): Variant | Instance | null {
  if (canNodeHaveChildren(node)) {
    for (const childId of node.children) {
      if (childId === childIdtoLookFor) {
        return node
      }
      const parentNode = findParentNodeInNode(
        childIdtoLookFor,
        workspace.byId[childId],
        workspace,
      )
      if (parentNode) return parentNode
    }
  }
  return null
}
