import { getComponentSchema } from "../../../components/catalog"
import type { ComponentId } from "../../../components/constants"
import { getChildrenIds } from "../components/get-children-ids"
import { getComponentByNodeId } from "../components/get-component-by-node-id"
import { getNodeCatalogId } from "../nodes/get-node-catalog-id"
import { getNodeById } from "../nodes/get-node-by-id"
import type {
  EntryNodeId,
  ReferenceId,
  Workspace,
} from "../../types"

export type ReferenceMap = Record<ReferenceId, EntryNodeId>

/**
 * Builds a map from agent reference ids (for example `$cref0.1.2`) to workspace node ids
 * after a node is added, so later wire actions can target real ids.
 */
export function getReferenceMap(
  ref: ReferenceId,
  addedNodeId: EntryNodeId,
  workspace: Workspace,
): ReferenceMap {
  const map: ReferenceMap = { [ref]: addedNodeId }
  const board = getComponentByNodeId(workspace, addedNodeId)
  if (!board) return map

  const children = getChildrenIds(board, addedNodeId)
  for (let index = 0; index < children.length; index++) {
    appendSubtreeRefs(map, board, children[index]!, `${ref}.${index}`, workspace)
  }
  return map
}

/**
 * Schema-aware reference map: walks the live variant tree under `addedNodeId`.
 */
export function getSchemaAwareReferenceMap(
  ref: ReferenceId,
  addedNodeId: EntryNodeId,
  workspace: Workspace,
): ReferenceMap {
  const map: ReferenceMap = { [ref]: addedNodeId }
  const node = getNodeById(addedNodeId, workspace)
  if (!node) return map

  const catalogId = getNodeCatalogId(node, workspace)
  if (!catalogId) return map

  try {
    const schema = getComponentSchema(catalogId as ComponentId)
    if (!schema) return map
  } catch {
    return map
  }

  const board = getComponentByNodeId(workspace, addedNodeId)
  if (!board) return map

  appendSubtreeRefs(map, board, addedNodeId, ref, workspace)
  return map
}

function appendSubtreeRefs(
  map: ReferenceMap,
  board: NonNullable<ReturnType<typeof getComponentByNodeId>>,
  nodeId: EntryNodeId,
  refPrefix: ReferenceId,
  workspace: Workspace,
): void {
  map[refPrefix] = nodeId
  const children = getChildrenIds(board, nodeId)
  for (let index = 0; index < children.length; index++) {
    const childId = children[index]!
    if (!workspace.nodes[childId]) continue
    appendSubtreeRefs(map, board, childId, `${refPrefix}.${index}`, workspace)
  }
}
