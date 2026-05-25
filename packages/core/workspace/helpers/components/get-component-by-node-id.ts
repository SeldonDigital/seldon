import type { ComponentEntry, EntryNodeId, Workspace } from "../../types"
import { walkComponentTreeRefs } from "./walk-component-tree-refs"

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
