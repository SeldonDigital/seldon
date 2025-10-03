import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import { workspaceService } from "../../../services/workspace.service"

/**
 * Reset the properties of a board
 */
export function handleResetBoardProperty(
  payload: ExtractPayload<"reset_board_property">,
  workspace: Workspace,
): Workspace {
  // Default merging to true

  if (rules.mutations.setProperties.board.allowed === false) {
    return workspace
  }

  return workspaceService.resetBoardProperty(
    payload.componentId,
    {
      propertyKey: payload.propertyKey,
      subpropertyKey: payload.subpropertyKey,
    },
    workspace,
  )
}
