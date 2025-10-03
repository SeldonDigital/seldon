import { rules } from "../../../../rules/config/rules.config"
import { workspaceService } from "../../../services/workspace.service"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Moves a child node to a new position within its parent's children array.
 *
 * @param payload Contains the child ID and new index
 * @param workspace Current workspace state
 * @returns Updated workspace with the child node moved
 */
export function handleReorderNode(
  payload: ExtractPayload<"reorder_node">,
  workspace: Workspace,
): Workspace {
  const { nodeId, newIndex } = payload
  const sourceNode = workspaceService.getNode(nodeId, workspace)
  const entityType = workspaceService.getEntityType(sourceNode)
  const { allowed, propagation } = rules.mutations.reorder[entityType]

  if (allowed) {
    if (workspaceService.isVariant(sourceNode)) {
      return workspaceService.reorderVariantIndex(
        sourceNode,
        newIndex,
        workspace,
      )
    }

    return workspaceService.propagateNodeOperation({
      nodeId,
      propagation,
      apply: (node, workspace) => {
        if (workspaceService.isInstance(node)) {
          return workspaceService.moveInstanceToIndex(node, newIndex, workspace)
        }

        throw new Error(
          "Cannot reorder a node that is not an instance using propagateNodeOperation",
        )
      },
      workspace,
    })
  }

  return workspace
}
