import type { ComponentTreeRef, EntryNodeId, Workspace } from "../../types"
import { getVariantTree } from "../components/get-variant-tree"
import { getWorkspaceNodes } from "../general/get-workspace-nodes"
import { findBoardContainingTreeNodeId } from "./duplicate-entry-variant-subtree"

function collectTreeRefIds(ref: ComponentTreeRef): EntryNodeId[] {
  const ids: EntryNodeId[] = [ref.id]
  for (const child of ref.children ?? []) {
    ids.push(...collectTreeRefIds(child))
  }
  return ids
}

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

/**
 * Reports whether `nodeId` or any descendant in its variant tree carries
 * property overrides. Used to decide if a node can be reset to its baseline.
 */
export function nodeSubtreeHasOverrides(
  nodeId: EntryNodeId,
  workspace: Workspace,
): boolean {
  const nodes = getWorkspaceNodes(workspace)
  return getNodeSubtreeIds(nodeId, workspace).some((id) => {
    const node = nodes[id]
    return node ? Object.keys(node.overrides ?? {}).length > 0 : false
  })
}
