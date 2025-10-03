import { Display, ValueType } from "../../../../properties"
import { rules } from "../../../../rules/config/rules.config"
import { workspaceService } from "../../../services/workspace.service"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Removes a node
 *
 * @param payload Contains the ID of the node to remove
 * @param workspace Current workspace state
 * @returns Updated workspace with the child removed from variant and all instances
 */
export function handleRemoveNode(
  payload: ExtractPayload<"remove_node">,
  workspace: Workspace,
): Workspace {
  const node = workspaceService.getNode(payload.nodeId, workspace)

  // Get the entity type from the node
  const entityType = workspaceService.getEntityType(node)

  // Get the configuration for this entity type
  const config = rules.mutations.delete[entityType]
  const removalBehavior =
    typeof config.removalBehavior === "string"
      ? config.removalBehavior
      : workspaceService.isInstance(node) &&
          workspaceService.isSchemaDefinedInstance(node)
        ? config.removalBehavior.schemaDefined
        : config.removalBehavior.manuallyAdded

  const { allowed, propagation } = config

  if (allowed) {
    return workspaceService.propagateNodeOperation({
      nodeId: payload.nodeId,
      propagation,
      apply: (node, workspace) => {
        if (removalBehavior === "delete") {
          // If the node is an instance, remove it from its parent's children array
          if (workspaceService.isInstance(node)) {
            return workspaceService.deleteInstance(node.id, workspace)
          }

          // If the node is a variant, remove it from the board's variants array
          return workspaceService.deleteVariant(node.id, workspace)
        }

        if (removalBehavior === "hide") {
          return workspaceService.setNodeProperties(
            node.id,
            {
              display: {
                type: ValueType.PRESET,
                value: Display.EXCLUDE,
              },
            },
            workspace,
          )
        }

        return workspace
      },
      workspace,
    })
  }

  return workspace
}
