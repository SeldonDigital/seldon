import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import { workspaceService } from "../../../services/workspace.service"

/**
 * Reset a property of a node in the workspace.
 *
 * This handler resets the property of the node to its initial value.
 * If the node doesn't exist, it throws an error.
 *
 * @param payload Contains the node ID and property key to reset
 * @param workspace Current workspace state
 * @returns Updated workspace with the node's property reset
 * @throws Error if the node doesn't exist
 */
export function handleResetNodeProperty(
  payload: ExtractPayload<"reset_node_property">,
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
        return workspaceService.resetNodeProperty(
          node.id,
          {
            propertyKey: payload.propertyKey,
            subpropertyKey: payload.subpropertyKey,
          },
          workspace,
        )
      },
      workspace,
    })
  }

  return workspace
}
