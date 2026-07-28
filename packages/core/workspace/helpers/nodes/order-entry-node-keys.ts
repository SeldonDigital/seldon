import type { EntryNode } from "../../model/entry-node"
import type { Workspace } from "../../model/workspace"

/**
 * Canonical key order for a serialized `EntryNode`. `ref` leads the entry as the
 * node's stable handle. Keys absent on a node are skipped, so optional fields
 * like `ref` and `origin` only appear when set.
 *
 * `id` is absent on purpose. It always repeats the key the node is stored under
 * in `nodes`, so it is dropped on write and restored from that key on read by
 * `restoreWorkspaceNodeIds`.
 */
const ENTRY_NODE_KEY_ORDER: readonly (keyof EntryNode)[] = [
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

/**
 * Returns a copy of a node with its keys in canonical serialization order and
 * its redundant `id` dropped.
 */
export function orderEntryNodeKeys(node: EntryNode): EntryNode {
  const ordered: Record<string, unknown> = {}

  for (const key of ENTRY_NODE_KEY_ORDER) {
    if (key in node && node[key] !== undefined) {
      ordered[key] = node[key]
    }
  }

  // Preserve any keys not covered by the canonical list, keeping output lossless
  // apart from the deliberately dropped `id`.
  for (const key of Object.keys(node)) {
    if (key !== "id" && !(key in ordered)) {
      ordered[key] = (node as unknown as Record<string, unknown>)[key]
    }
  }

  return ordered as unknown as EntryNode
}

/**
 * Returns a copy of the workspace whose `nodes` entries use the canonical key
 * order and carry no `id`. Use before serializing a workspace to JSON so node
 * fields persist in a stable, readable order. Other top-level maps are left
 * untouched.
 */
export function orderWorkspaceNodeKeys(workspace: Workspace): Workspace {
  const nodes: Workspace["nodes"] = {}

  for (const [id, node] of Object.entries(workspace.nodes)) {
    nodes[id] = orderEntryNodeKeys(node)
  }

  return { ...workspace, nodes }
}
