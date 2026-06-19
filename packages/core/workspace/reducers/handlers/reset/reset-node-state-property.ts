import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  nodeRetrievalService,
  typeCheckingService,
  workspaceMutationService,
  workspacePropagationService,
} from "../../../services"

/**
 * Drops one property on a node's state bag when rules allow. Uses the same
 * policy as state writes, so instances cannot clear inherited state.
 */
export function resetNodeStateProperty(
  payload: ExtractPayload<"reset_node_state_property">,
  workspace: Workspace,
): Workspace {
  const node = nodeRetrievalService.getNode(payload.nodeId, workspace)
  const entityType = typeCheckingService.getEntityType(node)
  const { allowed, propagation } = rules.mutations.setStateProperties[entityType]

  if (!allowed) {
    return workspace
  }

  return workspacePropagationService.propagateNodeOperation({
    nodeId: payload.nodeId,
    propagation,
    apply: (node, workspace) =>
      workspaceMutationService.resetNodeStateProperty(
        node.id,
        payload.state,
        {
          propertyKey: payload.propertyKey,
          subpropertyKey: payload.subpropertyKey,
          layerIndex: payload.layerIndex,
        },
        workspace,
      ),
    workspace,
  })
}
