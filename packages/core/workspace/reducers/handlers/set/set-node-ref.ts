import type { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  nodeRetrievalService,
  typeCheckingService,
  workspaceMutationService,
  workspacePropagationService,
} from "../../../services"

/**
 * Applies a node's unique reference handle when ref rules allow.
 * Propagation stays "none" so a ref is never copied onto other nodes.
 */
export function setNodeRef(
  payload: ExtractPayload<"set_node_ref">,
  workspace: Workspace,
): Workspace {
  const node = nodeRetrievalService.getNode(payload.nodeId, workspace)
  const entityType = typeCheckingService.getEntityType(node)
  const { allowed, propagation } = rules.mutations.setRef[entityType]

  if (!allowed) {
    return workspace
  }

  return workspacePropagationService.propagateNodeOperation({
    nodeId: payload.nodeId,
    propagation,
    apply: (node, workspace) =>
      workspaceMutationService.setNodeRef(node.id, payload.ref, workspace),
    workspace,
  })
}
