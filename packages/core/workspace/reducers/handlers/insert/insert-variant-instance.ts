import { ExtractPayload, Workspace } from "../../../../index"
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
import type { ValidationOptions } from "../../helpers/validation"

export function insertVariantInstance(
  payload: ExtractPayload<"insert_variant_instance">,
  workspace: Workspace,
  options: ValidationOptions = {},
): Workspace {
  const nodeToInstantiate = nodeRetrievalService.getNode(
    payload.variantId,
    workspace,
  )
  const targetNode = nodeRetrievalService.getNode(
    payload.target.parentId,
    workspace,
  )

  if (!typeCheckingService.isVariant(nodeToInstantiate)) {
    return workspace
  }

  if (
    typeCheckingService.isVariant(targetNode) &&
    typeCheckingService.isDefaultVariant(targetNode)
  ) {
    debugGroup("Workspace", "insertVariantInstance", "Insert not allowed")
    debugLog(
      "Workspace",
      "insertVariantInstance",
      "Insert not allowed - cannot insert into default variant",
      {
        targetNodeId: targetNode.id,
      },
    )
    debugGroupEnd(
      "Workspace",
      "insertVariantInstance",
      "Insert not allowed - cannot insert into default variant",
    )
    return workspace
  }

  debugGroup("Workspace", "insertVariantInstance", "Inserting variant instance")
  debugLog("Workspace", "insertVariantInstance", "Variant to instantiate", {
    variantId: payload.variantId,
  })
  debugLog("Workspace", "insertVariantInstance", "Target parent", {
    parentId: payload.target.parentId,
    index: payload.target.index,
  })

  const targetEntityType = typeCheckingService.getEntityType(targetNode)
  if (!rules.mutations.insertInto[targetEntityType].allowed) {
    debugLog(
      "Workspace",
      "insertVariantInstance",
      "Insert not allowed - target cannot receive nodes",
    )
    debugGroupEnd(
      "Workspace",
      "insertVariantInstance",
      "Insert not allowed - target cannot receive nodes",
    )
    return workspace
  }

  const entityType = typeCheckingService.getEntityType(nodeToInstantiate)
  const { allowed, propagation } = rules.mutations.instantiate[entityType]
  if (!allowed) {
    debugLog(
      "Workspace",
      "insertVariantInstance",
      "Insert not allowed - variant cannot be instantiated",
    )
    debugGroupEnd(
      "Workspace",
      "insertVariantInstance",
      "Insert not allowed - variant cannot be instantiated",
    )
    return workspace
  }

  debugLog(
    "Workspace",
    "insertVariantInstance",
    "Insert allowed, applying with propagation",
    {
      propagation,
    },
  )

  const result = workspacePropagationService.propagateNodeOperation<
    ReturnType<typeof nodeOperationsService.insertNode>
  >({
    nodeId: payload.target.parentId,
    propagation,
    apply: (node, workspace, sourceResult) => {
      debugLog(
        "Workspace",
        "insertVariantInstance",
        "Inserting variant instance into parent",
        {
          nodeId: sourceResult ? sourceResult.createdNodeId : payload.variantId,
          parentId: node.id,
          index: payload.target.index,
        },
      )

      return nodeOperationsService.insertNode(
        {
          nodeId: sourceResult ? sourceResult.createdNodeId : payload.variantId,
          parentId: node.id,
          parentIndex: payload.target.index,
        },
        workspace,
      )
    },
    workspace,
  })

  debugLog("Workspace", "insertVariantInstance", "Variant instance inserted")
  debugGroupEnd(
    "Workspace",
    "insertVariantInstance",
    "Variant instance inserted",
  )
  return result
}
