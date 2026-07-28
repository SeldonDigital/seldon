import type { EntryNode } from "../../model/entry-node"
import type { Workspace } from "../../model/workspace"

/**
 * Returns a copy of the workspace whose `nodes` entries each carry an `id` taken
 * from the key they are stored under. Serialized files omit `id` because it
 * always repeats that key, so this restores the in-memory shape on read. The map
 * key wins over any `id` already present, so a stale value from an older file is
 * corrected rather than trusted.
 */
export function restoreWorkspaceNodeIds(workspace: Workspace): Workspace {
  const nodes: Record<string, EntryNode> = {}

  for (const [id, node] of Object.entries(workspace.nodes)) {
    nodes[id] = { ...node, id }
  }

  return { ...workspace, nodes }
}
