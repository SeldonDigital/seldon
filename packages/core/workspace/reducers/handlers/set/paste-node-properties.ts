import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  nodeRetrievalService,
  typeCheckingService,
  workspaceMutationService,
  workspacePropagationService,
} from "../../../services"

/**
 * Pastes a copied look onto a node when rules allow, using configured
 * propagation. Reuses the setProperties rules bucket because a paste is a
 * property write; the mutation filters keys to the target's vocabulary and
 * adapts layered paint stacks.
 */
export function pasteNodeProperties(
  payload: ExtractPayload<"paste_node_properties">,
  workspace: Workspace,
): Workspace {
  const node = nodeRetrievalService.getNode(payload.nodeId, workspace)
  const entityType = typeCheckingService.getEntityType(node)
  const { allowed, propagation } = rules.mutations.setProperties[entityType]

  if (!allowed) {
    return workspace
  }

  return workspacePropagationService.propagateNodeOperation({
    nodeId: payload.nodeId,
    propagation,
    apply: (node, workspace) =>
      workspaceMutationService.pasteNodeProperties(
        node.id,
        payload.properties,
        workspace,
      ),
    workspace,
  })
}
