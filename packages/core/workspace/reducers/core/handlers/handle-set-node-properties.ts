import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import { workspaceService } from "../../../services/workspace.service"

/**
 * Set the properties of a node in the workspace.
 *
 * This handler merges the provided properties with the existing properties of the node.
 * If the node doesn't exist, it throws an error.
 *
 * @param payload Contains the node ID and properties to set
 * @param workspace Current workspace state
 * @returns Updated workspace with the node's properties updated
 * @throws Error if the node doesn't exist
 */
export function handleSetNodeProperties(
  payload: ExtractPayload<"set_node_properties">,
  workspace: Workspace,
): Workspace {
  const node = workspaceService.getNode(payload.nodeId, workspace)
  const entityType = workspaceService.getEntityType(node)
  const { allowed, propagation } = rules.mutations.setProperties[entityType]

  // If the config does not allow setting properties on this entity type, return the original workspace
  if (allowed) {
    return workspaceService.propagateNodeOperation({
      nodeId: payload.nodeId,
      propagation,
      apply: (node, workspace) => {
        return workspaceService.setNodeProperties(
          node.id,
          payload.properties,
          workspace,
          payload.options,
        )
      },
      workspace,
    })
  }

  return workspace
}
