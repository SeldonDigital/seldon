import type { EntryNodeId, Workspace } from "../../types"
import { getVariantTree } from "../components/get-variant-tree"
import { collectTreeRefIds } from "./collect-tree-ref-ids"
import { findBoardContainingTreeNodeId } from "./duplicate-entry-variant-subtree"

/**
 * Collects the node id of `nodeId` plus every descendant in its variant tree.
 * Returns `[nodeId]` when the node has no tree entry.
 */
export function getNodeSubtreeIds(
  nodeId: EntryNodeId,
  workspace: Workspace,
): EntryNodeId[] {
  const located = findBoardContainingTreeNodeId(workspace, nodeId)
  if (!located) return [nodeId]
  const tree = getVariantTree(located.board, nodeId)
  if (!tree) return [nodeId]
  return collectTreeRefIds(tree)
}
