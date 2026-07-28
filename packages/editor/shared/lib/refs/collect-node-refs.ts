import { findBoardContainingTreeNodeId } from "@seldon/core/workspace/helpers/nodes/duplicate-entry-variant-subtree"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"

import type { Workspace } from "@seldon/core/workspace/types"

/**
 * One referenced node as the workspace knows it. This is the view half of a
 * binding: the node a ref names, and where it sits.
 *
 * `boardLabel` is the board's own label, so a binding can be reported as
 * belonging to something the user recognizes on the canvas.
 */
export interface NodeRef {
  ref: string
  nodeId: string
  componentId: string | null
  boardKey: string | null
  boardLabel: string | null
}

/**
 * Collects every node in the workspace that carries a ref.
 *
 * A ref is a field on the node entry rather than a property, so this reads
 * `workspace.nodes` directly.
 *
 * A ref is meant to be unique, and core rejects a duplicate through
 * `set_node_ref`, but a stored workspace can still hold two nodes with the same
 * ref. So this returns one entry per node and never collapses by name. A caller
 * that needs a single node for a name has to decide which one it means.
 *
 * Named for node refs on purpose. Other helpers named `*Ref*` in core deal with
 * component tree refs and theme refs, which are unrelated.
 */
export function collectNodeRefs(workspace: Workspace): NodeRef[] {
  const nodes = workspace.nodes

  if (!nodes) return []

  const refs: NodeRef[] = []

  for (const node of Object.values(nodes)) {
    const ref = node.ref?.trim()

    if (!ref) continue

    const board = findBoardContainingTreeNodeId(workspace, node.id)

    refs.push({
      ref,
      nodeId: node.id,
      componentId: getNodeCatalogId(node, workspace),
      boardKey: board?.boardKey ?? null,
      boardLabel: board?.board.label ?? null,
    })
  }

  return refs.sort((a, b) => a.ref.localeCompare(b.ref))
}
