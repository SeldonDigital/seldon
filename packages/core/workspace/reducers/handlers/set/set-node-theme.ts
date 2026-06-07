import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  nodeRetrievalService,
  workspaceMutationService,
  workspacePropagationService,
  typeCheckingService,
} from "../../../services"

/**
 * Sets a node theme reference when rules allow, using configured propagation.
 */
export function setNodeTheme(
  payload: ExtractPayload<"set_node_theme">,
  workspace: Workspace,
): Workspace {
  const node = nodeRetrievalService.getNode(payload.nodeId, workspace)
  const entityType = typeCheckingService.getEntityType(node)
  const { allowed, propagation } = rules.mutations.setTheme[entityType]

  if (!allowed) {
    return workspace
  }

  return workspacePropagationService.propagateNodeOperation({
    nodeId: payload.nodeId,
    propagation,
    apply: (node, workspace) => {
      return workspaceMutationService.setNodeTheme(node.id, payload.theme, workspace)
    },
    workspace,
  })
}
