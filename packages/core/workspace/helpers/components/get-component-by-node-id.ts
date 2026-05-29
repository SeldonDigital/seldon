import { isDraft } from "immer"
import type { ComponentEntry, EntryNodeId, Workspace } from "../../types"
import { walkComponentTreeRefs } from "./walk-component-tree-refs"

/**
 * Maps every node id in a workspace to the board whose variant tree lists it.
 * Keyed on the `components` object reference. Reducers build a new `components`
 * reference through Immer when a board tree changes, so reads on an unchanged
 * workspace reuse the cached index. Drafts bypass the cache (see below).
 */
const nodeToBoardCache = new WeakMap<object, Map<string, ComponentEntry>>()

function buildNodeToBoardIndex(
  workspace: Workspace,
): Map<string, ComponentEntry> {
  const index = new Map<string, ComponentEntry>()
  for (const board of Object.values(workspace.components)) {
    walkComponentTreeRefs(board.variants, (ref) => {
      // Keep the first board that lists the id to match scan order.
      if (!index.has(ref.id)) {
        index.set(ref.id, board)
      }
    })
  }
  return index
}

function scanComponentByNodeId(
  workspace: Workspace,
  nodeId: EntryNodeId,
): ComponentEntry | null {
  for (const board of Object.values(workspace.components)) {
    let found = false
    walkComponentTreeRefs(board.variants, (ref) => {
      if (ref.id !== nodeId) return
      found = true
      return true
    })
    if (found) return board
  }
  return null
}

/**
 * Gets the board whose variant tree lists this node id.
 *
 * Returns null when no variant tree contains that id.
 *
 * @param workspace Workspace to search.
 * @param nodeId Node id to find.
 */
export function getComponentByNodeId(
  workspace: Workspace,
  nodeId: EntryNodeId,
): ComponentEntry | null {
  const components = workspace.components

  // Immer drafts mutate in place while keeping a stable proxy identity, so a
  // cached index would go stale during a reducer pass. Scan directly instead.
  if (isDraft(workspace) || isDraft(components)) {
    return scanComponentByNodeId(workspace, nodeId)
  }

  let index = nodeToBoardCache.get(components)
  if (!index) {
    index = buildNodeToBoardIndex(workspace)
    nodeToBoardCache.set(components, index)
  }

  return index.get(nodeId) ?? null
}
