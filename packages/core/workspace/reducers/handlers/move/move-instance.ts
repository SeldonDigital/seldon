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
      const resolvedInstance = nodeTraversalService.findNodeByPath(
        node,
        instanceNodePath,
        workspace,
      )
      const resolvedTarget = nodeTraversalService.findNodeByPath(
        node,
        targetNodePath,
        workspace,
      )

      if (
        resolvedInstance &&
        typeCheckingService.isInstance(resolvedInstance) &&
        resolvedTarget
      ) {
        return nodeOperationsService.moveInstance(
          resolvedInstance.id,
          { parentId: resolvedTarget.id, index },
          workspace,
        )
      }

      // Path resolution stops short for `node:` linked instances because their
      // componentId cannot be derived, so `findNodeByPath` returns the root
      // variant instead of the instance. On the originating variant, fall back to
      // the concrete payload ids so the move still applies. Downstream copies are
      // left untouched since their placement cannot be expressed as a tree path.
      if (
        node.id === rootVariant.id &&
        typeCheckingService.isInstance(instanceNode)
      ) {
        return nodeOperationsService.moveInstance(
          instanceNodeId,
          { parentId: targetNodeId, index },
          workspace,
        )
      }

      return workspace
    },
    workspace,
  })
}
