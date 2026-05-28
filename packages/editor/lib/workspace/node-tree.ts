import { ComponentId, isComponentId } from "@seldon/core/components/constants"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { nodeRelationshipService } from "@seldon/core/workspace/services/nodes/node-relationship.service"
import type {
  ComponentEntry,
  EntryNode,
  EntryNodeId,
  Workspace,
} from "@seldon/core/workspace/types"
import { getChildNodeIds } from "./component-tree"

export function getNodeCatalogComponentId(
  node: EntryNode,
  workspace: Workspace,
): ComponentId | null {
  const catalogId = getNodeCatalogId(node, workspace)
  if (catalogId && isComponentId(catalogId)) {
    return catalogId
  }
  return null
}

export function getNodeChildIds(
  node: EntryNode,
  workspace: Workspace,
): EntryNodeId[] {
  const board = nodeRelationshipService.findComponentForNode(node, workspace)
  if (!board) return []
  return getChildNodeIds(board, node.id)
}

export function findComponentForNode(
  node: EntryNode,
  workspace: Workspace,
): ComponentEntry | null {
  return nodeRelationshipService.findComponentForNode(node, workspace)
}
