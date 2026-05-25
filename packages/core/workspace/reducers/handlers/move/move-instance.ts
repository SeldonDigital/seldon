import { rules } from "../../../../rules/config/rules.config"
import {
  nodeRetrievalService,
  nodeTraversalService,
  nodeRelationshipService,
  nodeOperationsService,
  workspaceMutationService,
  workspaceThemeService,
  workspacePropagationService,
  typeCheckingService,
} from "../../../services"
import { ExtractPayload, Workspace } from "../../../types"
import type { ValidationOptions } from "../../helpers/validation"

/**
 * Moves an instance to a new parent and index, then applies the same placement
 * change to downstream instances that still match the original tree paths.
 */
export function moveInstance(
  payload: ExtractPayload<"move_instance">,
  workspace: Workspace,
  options: ValidationOptions = {},
): Workspace {
  const instanceNodeId = payload.instanceId
  const targetNodeId = payload.target.parentId
  const index = payload.target.index ?? 0

  const instanceNode = nodeRetrievalService.getNode(instanceNodeId, workspace)
  const targetNode = nodeRetrievalService.getNode(targetNodeId, workspace)
  const entityType = typeCheckingService.getEntityType(instanceNode)
  const { allowed, propagation } = rules.mutations.move[entityType]

  if (!allowed) return workspace

  const rootVariant = nodeRelationshipService.getRootVariant(instanceNode, workspace)
  const instanceNodePath = nodeTraversalService.getNodePath(instanceNode, workspace)
  const targetNodePath = nodeTraversalService.getNodePath(targetNode, workspace)

  return workspacePropagationService.propagateNodeOperation<
    ReturnType<typeof nodeOperationsService.moveInstance>
  >({
    nodeId: rootVariant.id,
    propagation,
    apply: (node, workspace) => {
      const instanceNode = nodeTraversalService.findNodeByPath(
        node,
        instanceNodePath,
        workspace,
      )
      const targetNode = nodeTraversalService.findNodeByPath(
        node,
        targetNodePath,
        workspace,
      )

      if (
        instanceNode &&
        typeCheckingService.isInstance(instanceNode) &&
        targetNode
      ) {
        return nodeOperationsService.moveInstance(
          instanceNode.id,
          { parentId: targetNode.id, index },
          workspace,
        )
      }

      return workspace
    },
    workspace,
  })
}
