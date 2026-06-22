import { Display, ValueType } from "../../../../properties"
import { rules } from "../../../../rules/config/rules.config"
import {
  debugGroup,
  debugGroupEnd,
  debugLog,
} from "../../../../utils/debug-logger"
import {
  nodeOperationsService,
  nodeRelationshipService,
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

  // Schema-defined removal behavior (hide) only applies inside the default
  // variant, where the schema tree must stay intact. User variants delete the
  // instance outright even when it chains back to a schema-defined default
  // child. Behavior is resolved once from the targeted node so downstream
  // propagation applies the same operation to every linked instance.
  const isSchemaDefinedInDefaultVariant = () =>
    typeCheckingService.isSchemaDefinedInstance(node) &&
    typeCheckingService.isDefaultVariant(
      nodeRelationshipService.getRootVariant(node, workspace),
    )
  const removalBehavior =
    typeof config.removalBehavior === "string"
      ? config.removalBehavior
      : isSchemaDefinedInDefaultVariant()
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

  const result = workspacePropagationService.propagatePositionalChildOperation({
    childId: payload.instanceId,
    propagation,
    applyToChild: (childId, workspace) => {
      const childNode = nodeRetrievalService.getNode(childId, workspace)
      if (!typeCheckingService.isInstance(childNode)) return workspace

      if (removalBehavior === "delete") {
        return nodeOperationsService.deleteInstance(childId, workspace)
      }

      if (removalBehavior === "hide") {
        return workspaceMutationService.setNodeProperties(
          childId,
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
