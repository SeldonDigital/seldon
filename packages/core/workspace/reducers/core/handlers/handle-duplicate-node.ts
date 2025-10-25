import { rules } from "../../../../rules/config/rules.config"
import { workspaceService } from "../../../services/workspace.service"
import { ExtractPayload, Workspace } from "../../../types"
import {
  ValidationOptions,
  logValidationResult,
  validateCoreOperation,
} from "../helpers/validation"

/**
 * Duplicate a child node and all its children
 *
 */
export function handleDuplicateNode(
  payload: ExtractPayload<"duplicate_node">,
  workspace: Workspace,
  options: ValidationOptions = {},
): Workspace {
  // Perform validation for AI operations or when explicitly requested
  if (options.isAiOperation || options.strict) {
    const validation = validateCoreOperation(
      "duplicate_node",
      payload,
      workspace,
      options,
    )
    logValidationResult("duplicate_node", validation, options)

    // For AI operations, we want to be more strict about validation failures
    if (options.isAiOperation && !validation.isValid) {
      // Continue execution but log the issues for AI debugging
    }
  }

  const node = workspaceService.getNode(payload.nodeId, workspace)
  const entityType = workspaceService.getEntityType(node)

  // If the config allows duplicating the entity, duplicate it
  if (rules.mutations.duplicate[entityType].allowed) {
    const propagation = rules.mutations.duplicate[entityType].propagation

    return workspaceService.propagateNodeOperation({
      nodeId: payload.nodeId,
      propagation,
      apply: (node, workspace) => {
        return workspaceService.duplicateNode(node.id, workspace)
      },
      workspace,
    })
  }

  return workspace
}
