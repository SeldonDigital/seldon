import { rules } from "../../../../rules/config/rules.config"
import {
  debugGroup,
  debugGroupEnd,
  debugLog,
} from "../../../../utils/debug-logger"
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

export function reorderInstanceInParent(
  payload: ExtractPayload<"reorder_instance_in_parent">,
  workspace: Workspace,
): Workspace {
  const { instanceId, newIndex } = payload
  const sourceNode = nodeRetrievalService.getNode(instanceId, workspace)
  const entityType = typeCheckingService.getEntityType(sourceNode)
  const isInstance = typeCheckingService.isInstance(sourceNode)

  debugGroup("Workspace", "reorderInstanceInParent", "Reordering instance")
  debugLog("Workspace", "reorderInstanceInParent", "Instance details", {
    instanceId,
    newIndex,
    entityType,
    isInstance,
  })

  if (!isInstance) {
    debugLog(
      "Workspace",
      "reorderInstanceInParent",
      "Reorder not allowed for non-instance",
    )
    debugGroupEnd(
      "Workspace",
      "reorderInstanceInParent",
      "Reorder not allowed for non-instance",
    )
    return workspace
  }

  const { allowed, propagation } = rules.mutations.reorder[entityType]

  if (allowed) {
    debugLog(
      "Workspace",
      "reorderInstanceInParent",
      "Reorder allowed, applying",
      {
        propagation,
      },
    )

    const result = workspacePropagationService.propagateNodeOperation({
      nodeId: instanceId,
      propagation,
      apply: (node, workspace) => {
        if (typeCheckingService.isInstance(node)) {
          debugLog(
            "Workspace",
            "reorderInstanceInParent",
            "Moving instance to new index",
            {
              instanceId: node.id,
              newIndex,
            },
          )
          return nodeOperationsService.moveInstanceToIndex(node, newIndex, workspace)
        }

        throw new Error(
          "Cannot reorder a node that is not an instance using propagateNodeOperation",
        )
      },
      workspace,
    })

    debugLog(
      "Workspace",
      "reorderInstanceInParent",
      "Instance reorder complete",
    )
    debugGroupEnd(
      "Workspace",
      "reorderInstanceInParent",
      "Instance reorder complete",
    )
    return result
  }

  debugLog(
    "Workspace",
    "reorderInstanceInParent",
    "Reorder not allowed for entity type",
  )
  debugGroupEnd(
    "Workspace",
    "reorderInstanceInParent",
    "Reorder not allowed for entity type",
  )
  return workspace
}
