import { getComponentSchema } from "../../components/catalog"
import { InstanceId, VariantId, Workspace } from "../types"
import { getNodeById } from "./get-node-by-id"

/**
 * Check if a node allows reordering of its children
 * @param nodeId ID of the node to check
 * @param workspace Workspace object containing the node
 * @returns True if the node allows reordering, false otherwise
 */
export function nodeAllowsReordering(
  nodeId: InstanceId | VariantId,
  workspace: Workspace,
) {
  const node = getNodeById(nodeId, workspace)
  const schema = getComponentSchema(node.component)
  return schema.restrictions?.reorderChildren !== false
}
