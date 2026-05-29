import { EntryNode, EntryNodeId, Workspace } from "../../types"
import { getImmediateParentIdInWorkspace } from "../components/get-node-parent-id"

/**
 * Finds the parent node of a child node by searching through all variants in the workspace.
 * @param nodeId - The ID of the child node to find the parent for
 * @param workspace - The workspace containing the nodes
 * @returns The parent node, or null if the node is not found or not a child
 */
export function findParentNode(
  nodeId: EntryNodeId,
  workspace: Workspace,
): EntryNode | null {
  const node = workspace.nodes[nodeId]

  if (!node) {
    return null
  }
  const parentId = getImmediateParentIdInWorkspace(workspace, nodeId)
  if (!parentId) return null
  return workspace.nodes[parentId] ?? null
}
