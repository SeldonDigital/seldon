import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  debugGroup,
  debugGroupEnd,
  debugLog,
} from "../../../../utils/debug-logger"
import {
  nodeRetrievalService,
  nodeOperationsService,
  workspacePropagationService,
  typeCheckingService,
} from "../../../services"

/**
 * Applies `insert_duplicate_instance`: copies an instance into a chosen parent
 * and index. Gated by `rules.mutations.insertInto[targetEntityType]` for the
 * destination and `rules.mutations.instantiate[entityType]` for the source copy.
 *
 * This is distinct from `duplicate_node`, which makes an in-place copy beside
 * the source and is gated by `rules.mutations.duplicate[entityType]`.
 */
export function insertDuplicateInstance(
  payload: ExtractPayload<"insert_duplicate_instance">,
  workspace: Workspace,
): Workspace {
  const nodeToDuplicate = nodeRetrievalService.getNode(
    payload.instanceId,
    workspace,
  )
  const targetNode = nodeRetrievalService.getNode(
    payload.target.parentId,
    workspace,
  )

  if (!typeCheckingService.isInstance(nodeToDuplicate)) {
    return workspace
  }

  if (
    typeCheckingService.isVariant(targetNode) &&
    typeCheckingService.isDefaultVariant(targetNode)
  ) {
    debugGroup("Workspace", "insertDuplicateInstance", "Insert not allowed")
    debugLog(
      "Workspace",
      "insertDuplicateInstance",
      "Insert not allowed - cannot insert into default variant",
      {
        targetNodeId: targetNode.id,
      },
    )
    debugGroupEnd(
      "Workspace",
      "insertDuplicateInstance",
      "Insert not allowed - cannot insert into default variant",
    )
    return workspace
  }

  debugGroup(
    "Workspace",
    "insertDuplicateInstance",
    "Inserting duplicate instance",
  )
  debugLog("Workspace", "insertDuplicateInstance", "Instance to duplicate", {
    instanceId: payload.instanceId,
  })
  debugLog("Workspace", "insertDuplicateInstance", "Target parent", {
    parentId: payload.target.parentId,
    index: payload.target.index,
  })

  const targetEntityType = typeCheckingService.getEntityType(targetNode)
  if (!rules.mutations.insertInto[targetEntityType].allowed) {
    debugLog(
      "Workspace",
      "insertDuplicateInstance",
      "Insert not allowed - target cannot receive nodes",
    )
    debugGroupEnd(
      "Workspace",
      "insertDuplicateInstance",
      "Insert not allowed - target cannot receive nodes",
    )
    return workspace
  }

  const entityType = typeCheckingService.getEntityType(nodeToDuplicate)
  const { allowed, propagation } = rules.mutations.instantiate[entityType]
  if (!allowed) {
    debugLog(
      "Workspace",
      "insertDuplicateInstance",
      "Insert not allowed - instance cannot be duplicated",
    )
    debugGroupEnd(
      "Workspace",
      "insertDuplicateInstance",
      "Insert not allowed - instance cannot be duplicated",
    )
    return workspace
  }

  debugLog(
    "Workspace",
    "insertDuplicateInstance",
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
        "insertDuplicateInstance",
        "Inserting duplicate instance into parent",
        {
          nodeId: sourceResult
            ? sourceResult.createdNodeId
            : payload.instanceId,
          parentId: node.id,
          index: payload.target.index,
        },
      )

      return nodeOperationsService.insertNode(
        {
          nodeId: sourceResult
            ? sourceResult.createdNodeId
            : payload.instanceId,
          parentId: node.id,
          parentIndex: payload.target.index,
        },
        workspace,
      )
    },
    workspace,
  })

  debugLog(
    "Workspace",
    "insertDuplicateInstance",
    "Duplicate instance inserted",
  )
  debugGroupEnd(
    "Workspace",
    "insertDuplicateInstance",
    "Duplicate instance inserted",
  )
  return result
}
