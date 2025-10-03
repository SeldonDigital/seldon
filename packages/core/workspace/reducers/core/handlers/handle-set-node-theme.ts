import { rules } from "../../../../rules/config/rules.config"
import { workspaceService } from "../../../services/workspace.service"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set the theme of a node
 */
export function handleSetNodeTheme(
  payload: ExtractPayload<"set_node_theme">,
  workspace: Workspace,
): Workspace {
  const node = workspaceService.getNode(payload.nodeId, workspace)
  const entityType = workspaceService.getEntityType(node)
  const { allowed, propagation } = rules.mutations.setTheme[entityType]

  // If the config does not allow setting theme on this entity type, return the original workspace
  if (!allowed) {
    return workspace
  }

  return workspaceService.propagateNodeOperation({
    nodeId: payload.nodeId,
    propagation,
    apply: (node, workspace) => {
      return workspaceService.setNodeTheme(node.id, payload.theme, workspace)
    },
    workspace,
  })
}
