import { getBoardByNodeId } from "../../helpers/components/get-board-by-node-id"
import { getChildrenIds } from "../../helpers/components/get-children-ids"
import { getWorkspaceNodes } from "../../helpers/general/get-workspace-nodes"
import { parseNodeLink } from "../../model/template-ref"
import type { EntryNodeId, Instance, Variant, Workspace } from "../../types"
import { nodeRelationshipService } from "./node-relationship.service"
import { nodeTraversalService } from "./node-traversal.service"

/**
 * Pure node-navigation resolvers. Each takes the current node and returns the id
 * to select next, or `null` when the move does not apply. They wrap existing
 * traversal services so the editor and a headless agent compute the same target.
 */

function getNodeById(
  workspace: Workspace,
  nodeId: EntryNodeId,
): Variant | Instance | null {
  const node = getWorkspaceNodes(workspace)[nodeId]
  return node ? (node as Variant | Instance) : null
}

/**
 * The most original node in the template chain: walk `node:` links upward until
 * a node whose template is `catalog:...`. Returns the same id when the node is
 * already catalog-rooted. The result may live on a different board.
 */
export function resolveOriginalNodeId(
  workspace: Workspace,
  nodeId: EntryNodeId,
): EntryNodeId | null {
  let current = nodeId
  while (true) {
    const node = getNodeById(workspace, current)
    if (!node) return null
    const link = parseNodeLink(node.template)
    if (!link || !getNodeById(workspace, link.nodeId)) return current
    current = link.nodeId
  }
}

/**
 * The source node one hop up the template chain: the equivalent node in the
 * variant this node derives from. Returns `null` when the node is catalog-rooted
 * (no `node:` template link).
 */
export function resolveSourceNodeId(
  workspace: Workspace,
  nodeId: EntryNodeId,
): EntryNodeId | null {
  const node = getNodeById(workspace, nodeId)
  if (!node) return null
  const link = parseNodeLink(node.template)
  if (link && getNodeById(workspace, link.nodeId)) return link.nodeId
  return null
}

/** The structural parent one level up the tree, or `null` at a root variant. */
export function resolveParentNodeId(
  workspace: Workspace,
  nodeId: EntryNodeId,
): EntryNodeId | null {
  const parent = nodeTraversalService.findParentNode(nodeId, workspace)
  return parent ? parent.id : null
}

/** The first structural child one level down the tree, or `null` when a leaf. */
export function resolveFirstChildNodeId(
  workspace: Workspace,
  nodeId: EntryNodeId,
): EntryNodeId | null {
  const board = getBoardByNodeId(workspace, nodeId)
  if (!board) return null
  return getChildrenIds(board, nodeId)[0] ?? null
}

/** The next sibling among the node's structural siblings, or `null` at the end. */
export function resolveNextSiblingNodeId(
  workspace: Workspace,
  nodeId: EntryNodeId,
): EntryNodeId | null {
  const node = getNodeById(workspace, nodeId)
  if (!node) return null
  const sibling = nodeRelationshipService.findAdjacent(node, "after", workspace)
  return sibling ? sibling.id : null
}

/** The previous sibling among the node's structural siblings, or `null` at the start. */
export function resolvePreviousSiblingNodeId(
  workspace: Workspace,
  nodeId: EntryNodeId,
): EntryNodeId | null {
  const node = getNodeById(workspace, nodeId)
  if (!node) return null
  const sibling = nodeRelationshipService.findAdjacent(node, "before", workspace)
  return sibling ? sibling.id : null
}
