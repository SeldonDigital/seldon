import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import { workspaceService } from "../../../services/workspace.service"

/**
 * Set the theme of a board
 */
export function handleSetBoardTheme(
  payload: ExtractPayload<"set_board_theme">,
  workspace: Workspace,
): Workspace {
  const { allowed } = rules.mutations.setTheme.board

  // If the config does not allow setting theme on this entity type, return the original workspace
  if (!allowed) {
    return workspace
  }

  return workspaceService.setBoardTheme(
    payload.componentId,
    payload.theme,
    workspace,
  )
}
