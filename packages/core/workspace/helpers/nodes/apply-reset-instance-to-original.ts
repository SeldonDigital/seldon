import { produce } from "immer"

import { formatNodeLink, parseNodeLink } from "../../model/template-ref"
import type { EntryNodeId, Workspace } from "../../types"
import { getNodeSubtreeIds } from "./get-node-subtree-ids"

/**
 * Walks `node:` template links upward until a node whose template is not a
 * resolvable node link, then returns that terminal id. Returns the same id when
 * the node is already catalog-rooted. Mirrors `resolveOriginalNodeId` without a
 * service dependency.
 */
function resolveOriginalId(
  workspace: Workspace,
  nodeId: EntryNodeId,
): EntryNodeId {
  let current = nodeId
  while (true) {
    const node = workspace.nodes[current]
    if (!node) return current
    const link = parseNodeLink(node.template)
    if (!link || !workspace.nodes[link.nodeId]) return current
    current = link.nodeId as EntryNodeId
  }
}

/**
 * Reverts an instance subtree to its most original template in place. For each
 * node in the subtree it clears the overrides and repoints the template to the
 * terminal of its template chain. Node ids and tree structure survive, so
 * downstream instances keep their links and their own overrides.
 */
export function applyResetInstanceToOriginal(
  workspace: Workspace,
  instanceId: EntryNodeId,
): Workspace {
  const subtreeIds = getNodeSubtreeIds(instanceId, workspace)
  const originalByNodeId = new Map<EntryNodeId, EntryNodeId>()
  for (const id of subtreeIds) {
    originalByNodeId.set(id, resolveOriginalId(workspace, id))
  }

  return produce(workspace, (draft) => {
    for (const id of subtreeIds) {
      const node = draft.nodes[id]
      if (!node) continue
      node.overrides = {}
      const originalId = originalByNodeId.get(id)
      if (originalId && originalId !== id) {
        node.template = formatNodeLink(originalId)
      }
    }
  })
}
