import type { Action } from "../../types"

/**
 * Error thrown when a workspace action fails pre-reducer validation.
 * Includes the action that caused the failure for debugging.
 */
export class WorkspaceValidationError extends Error {
  action: Action

  constructor(message: string, action: Action) {
    super(message)
    this.name = "WorkspaceValidationError"
    this.action = action
  }
}
