import { EntryNode, EntryNodeId, Workspace } from "../../types"
import { findComponentByTreeNodeId } from "../components/find-component-by-tree-node-id"
import { getImmediateParentId } from "../components/get-parent-ids"

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
  const board = findComponentByTreeNodeId(workspace, nodeId)
  if (!board) return null
  const parentId = getImmediateParentId(board, nodeId)
  if (!parentId) return null
  return workspace.nodes[parentId] ?? null
}
