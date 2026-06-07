import type { Middleware } from "../../types"
import { validateAction } from "./validate-action"
import { WorkspaceValidationError } from "./workspace-validation-error"

export { WorkspaceValidationError } from "./workspace-validation-error"
export { check } from "./check"
export { getNodeComponentId } from "./node-component-id"
export { validateAction } from "./validate-action"

/**
 * Middleware that validates actions before they're processed by the reducer.
 * Throws WorkspaceValidationError for invalid operations.
 */
export const validationMiddleware: Middleware =
  (next) => (workspace, action) => {
    try {
      validateAction(workspace, action)
    } catch (error) {
      if (error instanceof Error) {
        throw new WorkspaceValidationError(error.message, action)
      }
      throw error
    }

    return next(workspace, action)
  }
