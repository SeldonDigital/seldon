import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import { workspaceMutationService } from "../../../services"

/**
 * Resets a component board to its defaults when rules allow: clears every
 * `componentProperties` override and returns the board theme to the default.
 */
export function resetComponentBoard(
  payload: ExtractPayload<"reset_component_board">,
  workspace: Workspace,
): Workspace {
  if (
    !rules.mutations.setProperties.board.allowed ||
    !rules.mutations.setTheme.board.allowed
  ) {
    return workspace
  }

  return workspaceMutationService.resetComponentBoard(
    payload.boardKey,
    workspace,
  )
}
