import { getComponentSchema } from "../../../components/catalog"
import { isComponentId } from "../../../components/constants"
import { EntryNodeId, Workspace } from "../../types"
import { getNodeCatalogId } from "./get-node-catalog-id"
import { getNodeById } from "./get-node-by-id"

/**
 * Check if a node allows reordering of its children
 * @param nodeId ID of the node to check
 * @param workspace Workspace object containing the node
 * @returns True if the node allows reordering, false otherwise
 */
export function nodeAllowsReordering(
  nodeId: EntryNodeId,
  workspace: Workspace,
) {
  const node = getNodeById(nodeId, workspace)
  const catalogId = getNodeCatalogId(node, workspace)
  if (!catalogId || !isComponentId(catalogId)) return true
  const schema = getComponentSchema(catalogId)
  return schema.restrictions?.reorderChildren !== false
}
