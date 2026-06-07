import { EntryNode, EntryNodeId, Workspace } from "../../types"
import { findBoardByTreeNodeId } from "../components/find-board-by-tree-node-id"
import { walkComponentTreeRefs } from "../components/walk-component-tree-refs"

/**
 * Recursively searches for the parent node that contains a specific child ID.
 * @param childIdtoLookFor - The child ID to search for
 * @param node - The node to search within
 * @param workspace - The workspace containing the nodes
 * @returns The parent node containing the child, or null if not found
 */
export function findParentNodeInNode(
  childIdtoLookFor: EntryNodeId,
  node: EntryNode,
  workspace: Workspace,
): EntryNode | null {
  const board = findBoardByTreeNodeId(workspace, node.id)
  if (!board) return null

  let parentId: EntryNodeId | null = null
  walkComponentTreeRefs(board.variants, (ref, parent) => {
    if (ref.id !== childIdtoLookFor) return
    parentId = parent?.id ?? null
    return true
  })

  if (!parentId) return null
  return workspace.nodes[parentId] ?? null
}
