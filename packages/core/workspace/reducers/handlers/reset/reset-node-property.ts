import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  nodeRetrievalService,
  nodeTraversalService,
  nodeRelationshipService,
  nodeOperationsService,
  workspaceMutationService,
  workspaceThemeService,
  workspacePropagationService,
  typeCheckingService,
} from "../../../services"

/**
 * Drops the given property on the node and matching instances when propagation allows it.
 */
export function resetNodeProperty(
  payload: ExtractPayload<"reset_node_property">,
  workspace: Workspace,
): Workspace {
  const node = nodeRetrievalService.getNode(payload.nodeId, workspace)
  const entityType = typeCheckingService.getEntityType(node)
  const { allowed, propagation } = rules.mutations.reset[entityType]

  if (!allowed) {
    return workspace
  }

  return workspacePropagationService.propagateNodeOperation({
    nodeId: payload.nodeId,
    propagation,
    apply: (node, workspace) =>
      workspaceMutationService.resetNodeProperty(
        node.id,
        {
          propertyKey: payload.propertyKey,
          subpropertyKey: payload.subpropertyKey,
        },
        workspace,
      ),
    workspace,
  })
}
