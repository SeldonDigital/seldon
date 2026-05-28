import { ComponentId } from "../../../../components/constants"
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
import type { InsertDefaultInstance, Workspace } from "../../../types"
import type { ValidationOptions } from "../../helpers/validation"

export function insertDefaultInstance(
  payload: InsertDefaultInstance,
  workspace: Workspace,
  options: ValidationOptions = {},
): Workspace {
  const defaultVariant = nodeRetrievalService.getDefaultVariant(
    payload.componentKey as ComponentId,
    workspace,
  )
  const targetNode = nodeRetrievalService.getNode(payload.parentId, workspace)

  if (
    typeCheckingService.isVariant(targetNode) &&
    typeCheckingService.isDefaultVariant(targetNode)
  ) {
    debugGroup("Workspace", "insertDefaultInstance", "Insert not allowed")
    debugLog(
      "Workspace",
      "insertDefaultInstance",
      "Insert not allowed - cannot insert into default variant",
      {
        targetNodeId: targetNode.id,
      },
    )
    debugGroupEnd(
      "Workspace",
      "insertDefaultInstance",
      "Insert not allowed - cannot insert into default variant",
    )
    return workspace
  }

  debugGroup("Workspace", "insertDefaultInstance", "Inserting default instance")
  debugLog(
    "Workspace",
    "insertDefaultInstance",
    "Default variant to instantiate",
    {
      variantId: defaultVariant.id,
    },
  )
  debugLog("Workspace", "insertDefaultInstance", "Target parent", {
    parentId: payload.parentId,
    index: payload.index,
  })

  const targetEntityType = typeCheckingService.getEntityType(targetNode)
  if (!rules.mutations.insertInto[targetEntityType].allowed) {
    debugLog(
      "Workspace",
      "insertDefaultInstance",
      "Insert not allowed - target cannot receive nodes",
    )
    debugGroupEnd(
      "Workspace",
      "insertDefaultInstance",
      "Insert not allowed - target cannot receive nodes",
    )
    return workspace
  }

  const entityType = typeCheckingService.getEntityType(defaultVariant)
  const { allowed, propagation } = rules.mutations.instantiate[entityType]
  if (!allowed) {
    debugLog(
      "Workspace",
      "insertDefaultInstance",
      "Insert not allowed - default variant cannot be instantiated",
    )
    debugGroupEnd(
      "Workspace",
      "insertDefaultInstance",
      "Insert not allowed - default variant cannot be instantiated",
    )
    return workspace
  }

  debugLog(
    "Workspace",
    "insertDefaultInstance",
    "Insert allowed, applying with propagation",
    {
      propagation,
    },
  )

  const result = workspacePropagationService.propagateNodeOperation<
    ReturnType<typeof nodeOperationsService.insertNode>
  >({
    nodeId: payload.parentId,
    propagation,
    apply: (node, workspace, sourceResult) => {
      debugLog(
        "Workspace",
        "insertDefaultInstance",
        "Inserting default instance into parent",
        {
          nodeId: sourceResult ? sourceResult.createdNodeId : defaultVariant.id,
          parentId: node.id,
          index: payload.index,
        },
      )

      return nodeOperationsService.insertNode(
        {
          nodeId: sourceResult ? sourceResult.createdNodeId : defaultVariant.id,
          parentId: node.id,
          parentIndex: payload.index,
        },
        workspace,
      )
    },
    workspace,
  })

  debugLog("Workspace", "insertDefaultInstance", "Default instance inserted")
  debugGroupEnd(
    "Workspace",
    "insertDefaultInstance",
    "Default instance inserted",
  )
  return result
}
