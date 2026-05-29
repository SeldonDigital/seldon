import { isDraft } from "immer"
import type { EntryNodeId, Workspace } from "../../types"
import { getImmediateParentId } from "./get-parent-ids"
import { getComponentByNodeId } from "./get-component-by-node-id"
import { walkComponentTreeRefs } from "./walk-component-tree-refs"

/**
 * Maps every node id in a workspace to its immediate parent id inside the board
 * variant trees. Root refs map to `null`. Keyed on the `components` object
 * reference so reads on an unchanged workspace reuse the cached index. Drafts
 * bypass the cache because they mutate in place during a reducer pass.
 */
const nodeToParentCache = new WeakMap<
  object,
  Map<string, EntryNodeId | null>
>()

function buildNodeToParentIndex(
  workspace: Workspace,
): Map<string, EntryNodeId | null> {
  const index = new Map<string, EntryNodeId | null>()
  for (const board of Object.values(workspace.components)) {
    walkComponentTreeRefs(board.variants, (ref, parent) => {
      // Keep the first occurrence to match single-board parent resolution.
      if (!index.has(ref.id)) {
        index.set(ref.id, (parent?.id as EntryNodeId | undefined) ?? null)
      }
    })
  }
  return index
}

/**
 * Gets the immediate parent id for a node id by searching the board variant
 * trees. Returns null for a root ref or a node id that is not in any tree.
 *
 * Equivalent to looking up the node's board and calling `getImmediateParentId`,
 * but backed by a memoized workspace-wide index.
 */
export function getImmediateParentIdInWorkspace(
  workspace: Workspace,
  nodeId: EntryNodeId,
): EntryNodeId | null {
  const components = workspace.components

  if (isDraft(workspace) || isDraft(components)) {
    const board = getComponentByNodeId(workspace, nodeId)
    return board ? getImmediateParentId(board, nodeId) : null
  }

  let index = nodeToParentCache.get(components)
  if (!index) {
    index = buildNodeToParentIndex(workspace)
    nodeToParentCache.set(components, index)
  }

  return index.get(nodeId) ?? null
}
