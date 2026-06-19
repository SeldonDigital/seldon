import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  nodeRetrievalService,
  typeCheckingService,
  workspaceMutationService,
  workspacePropagationService,
} from "../../../services"

/**
 * Merges properties into a node's override bag for an interaction state when
 * rules allow. State authoring is allowed on default and user variants only;
 * instances are blocked and inherit their source variant's state.
 */
export function setNodeStateProperties(
  payload: ExtractPayload<"set_node_state_properties">,
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
      workspaceMutationService.setNodeStateProperties(
        node.id,
        payload.state,
        payload.properties,
        workspace,
        payload.options,
      ),
    workspace,
  })
}
