import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import { workspaceService } from "../../../services/workspace.service"

/**
 * Remove a board from the workspace.
 */
export function handleRemoveBoard(
  payload: ExtractPayload<"remove_board">,
  workspace: Workspace,
): Workspace {
  if (rules.mutations.delete.board.allowed === false) {
    return workspace
  }

  return workspaceService.deleteBoard(payload.componentId, workspace)
}
