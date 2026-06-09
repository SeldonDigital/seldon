import { Display, ValueType } from "../../../../properties"
import { rules } from "../../../../rules/config/rules.config"
import {
  debugGroup,
  debugGroupEnd,
  debugLog,
} from "../../../../utils/debug-logger"
import {
  nodeOperationsService,
  nodeRetrievalService,
  typeCheckingService,
  workspaceMutationService,
  workspacePropagationService,
} from "../../../services"
import { ExtractPayload, Workspace } from "../../../types"

export function removeInstance(
  payload: ExtractPayload<"remove_instance">,
  workspace: Workspace,
): Workspace {
  const node = nodeRetrievalService.getNode(payload.instanceId, workspace)
  const entityType = typeCheckingService.getEntityType(node)
  const isInstance = typeCheckingService.isInstance(node)
  const isSchemaDefined =
    isInstance && typeCheckingService.isSchemaDefinedInstance(node)

  debugGroup("Workspace", "removeInstance", "Removing instance")
  debugLog("Workspace", "removeInstance", "Instance details", {
    instanceId: payload.instanceId,
    entityType,
    isInstance,
    isSchemaDefined,
  })

  if (!isInstance) {
    debugLog(
      "Workspace",
      "removeInstance",
      "Removal not allowed for non-instance",
    )
    debugGroupEnd(
      "Workspace",
      "removeInstance",
      "Removal not allowed for non-instance",
    )
    return workspace
  }

  const config = rules.mutations.delete.instance
  const removalBehavior =
    typeof config.removalBehavior === "string"
      ? config.removalBehavior
      : typeCheckingService.isSchemaDefinedInstance(node)
        ? config.removalBehavior.schemaDefined
        : config.removalBehavior.manuallyAdded

  const { allowed, propagation } = config

  debugLog("Workspace", "removeInstance", "Removal configuration", {
    allowed,
    propagation,
    removalBehavior,
  })

  if (!allowed) {
    debugLog("Workspace", "removeInstance", "Removal not allowed for instance")
    debugGroupEnd(
      "Workspace",
      "removeInstance",
      "Removal not allowed for instance",
    )
    return workspace
  }

  const result = workspacePropagationService.propagateNodeOperation({
    nodeId: payload.instanceId,
    propagation,
    apply: (node, workspace) => {
      if (!typeCheckingService.isInstance(node)) return workspace

      if (removalBehavior === "delete") {
        return nodeOperationsService.deleteInstance(node.id, workspace)
      }

      if (removalBehavior === "hide") {
        return workspaceMutationService.setNodeProperties(
          node.id,
          {
            display: {
              type: ValueType.OPTION as const,
              value: Display.EXCLUDE,
            },
          },
          workspace,
        )
      }

      return workspace
    },
    workspace,
  })

  debugLog("Workspace", "removeInstance", "Instance removal complete")
  debugGroupEnd("Workspace", "removeInstance", "Instance removal complete")
  return result
}
