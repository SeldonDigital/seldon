import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  nodeRetrievalService,
  typeCheckingService,
  workspaceMutationService,
  workspacePropagationService,
} from "../../../services"

/**
 * Clears every override on the node, reverting it to its template baseline.
 * For a default variant this restores catalog defaults; for an instance it
 * reverts to the variant or catalog it is based on.
 */
export function resetNode(
  payload: ExtractPayload<"reset_node">,
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
      workspaceMutationService.resetNodeOverrides(node.id, workspace),
    workspace,
  })
}
