import type { EntryNode } from "../../model/entry-node"
import type { Workspace } from "../../model/workspace"

/**
 * Canonical key order for a serialized `EntryNode`. `ref` sits right after `id`
 * so a node's stable identifiers lead the entry. Keys absent on a node are
 * skipped, so optional fields like `ref` and `origin` only appear when set.
 */
const ENTRY_NODE_KEY_ORDER: readonly (keyof EntryNode)[] = [
  "id",
  "ref",
  "type",
  "level",
  "label",
  "theme",
  "template",
  "overrides",
  "origin",
  "__editor",
]

/** Returns a copy of a node with its keys in canonical serialization order. */
export function orderEntryNodeKeys(node: EntryNode): EntryNode {
  const ordered: Record<string, unknown> = {}

  for (const key of ENTRY_NODE_KEY_ORDER) {
    if (key in node && node[key] !== undefined) {
      ordered[key] = node[key]
    }
  }

  // Preserve any keys not covered by the canonical list, keeping output lossless.
  for (const key of Object.keys(node)) {
    if (!(key in ordered)) {
      ordered[key] = (node as unknown as Record<string, unknown>)[key]
    }
  }

  return ordered as unknown as EntryNode
}

/**
 * Returns a copy of the workspace whose `nodes` entries use the canonical key
 * order. Use before serializing a workspace to JSON so node fields persist in a
 * stable, readable order. Other top-level maps are left untouched.
 */
export function orderWorkspaceNodeKeys(workspace: Workspace): Workspace {
  const nodes: Workspace["nodes"] = {}

  for (const [id, node] of Object.entries(workspace.nodes)) {
    nodes[id] = orderEntryNodeKeys(node)
  }

  return { ...workspace, nodes }
}
