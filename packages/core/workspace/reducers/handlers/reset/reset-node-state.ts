import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  nodeRetrievalService,
  typeCheckingService,
  workspaceMutationService,
  workspacePropagationService,
} from "../../../services"

/**
 * Clears a node's entire override bag for one interaction state when rules
 * allow. Uses the same policy as state writes, so instances are blocked.
 */
export function resetNodeState(
  payload: ExtractPayload<"reset_node_state">,
  workspace: Workspace,
): Workspace {
  const node = nodeRetrievalService.getNode(payload.nodeId, workspace)
  const entityType = typeCheckingService.getEntityType(node)
  const { allowed, propagation } =
    rules.mutations.setStateProperties[entityType]

  if (!allowed) {
    return workspace
  }

  return workspacePropagationService.propagateNodeOperation({
    nodeId: payload.nodeId,
    propagation,
    apply: (node, workspace) =>
      workspaceMutationService.resetNodeState(
        node.id,
        payload.state,
        workspace,
      ),
    workspace,
  })
}
