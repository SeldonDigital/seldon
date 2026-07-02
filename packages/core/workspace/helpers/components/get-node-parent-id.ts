import type { EntryNodeId, Workspace } from "../../types"
import { getNodeParentIndex } from "../graph/build-node-parent-index"

/**
 * Gets the immediate parent id for a node id by searching the board and
 * playground variant trees. Returns null for a root ref or a node id that is
 * not in any tree.
 *
 * Backed by the memoized workspace-wide index from `getNodeParentIndex`, so
 * every parent lookup shares one deterministic iteration order (ascending
 * board key, variants order, depth-first pre-order, first parent wins).
 */
export function getImmediateParentIdInWorkspace(
  workspace: Workspace,
  nodeId: EntryNodeId,
): EntryNodeId | null {
  const parentId = getNodeParentIndex(workspace).get(nodeId)
  return (parentId as EntryNodeId | undefined) ?? null
}
