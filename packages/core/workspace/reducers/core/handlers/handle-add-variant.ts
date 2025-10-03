import { workspaceService } from "../../../services/workspace.service"
import { ExtractPayload, Workspace } from "../../../types"
import {
  ValidationOptions,
  logValidationResult,
  validateCoreOperation,
} from "../helpers/validation"
import { handleDuplicateNode } from "./handle-duplicate-node"

/**
 * Adds a variant by instantiating the default variant of the given component.
 * Initial overrides to the default variant properties can be provided.
 */
export function handleAddVariant(
  payload: ExtractPayload<"add_variant">,
  workspace: Workspace,
  options: ValidationOptions = {},
) {
  // Perform validation for AI operations or when explicitly requested
  if (options.isAiOperation || options.strict) {
    const validation = validateCoreOperation(
      "add_variant",
      payload,
      workspace,
      options,
    )
    logValidationResult("add_variant", validation, options)

    // For AI operations, we want to be more strict about validation failures
    if (options.isAiOperation && !validation.isValid) {
      console.warn(
        `Add variant validation failed for component ${payload.componentId}:`,
        validation.errors,
      )
      // Continue execution but log the issues for AI debugging
    }
  }

  const defaultVariant = workspaceService.getDefaultVariant(
    payload.componentId,
    workspace,
  )

  return handleDuplicateNode({ nodeId: defaultVariant.id }, workspace, options)
}
