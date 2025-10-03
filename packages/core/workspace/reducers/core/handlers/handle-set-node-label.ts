import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import { workspaceService } from "../../../services/workspace.service"

/**
 * Set the label of a node
 */
export function handleSetNodeLabel(
  payload: ExtractPayload<"set_node_label">,
  workspace: Workspace,
): Workspace {
  const node = workspaceService.getNode(payload.nodeId, workspace)
  const entityType = workspaceService.getEntityType(node)
  const { allowed, propagation } = rules.mutations.rename[entityType]

  // If the config allows renaming the entity, rename it
  if (allowed) {
    return workspaceService.propagateNodeOperation({
      nodeId: payload.nodeId,
      propagation,
      apply: (node, workspace) =>
        workspaceService.setNodeLabel(node.id, payload.label, workspace),
      workspace,
    })
  }

  return workspace
}
