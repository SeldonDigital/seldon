import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import { workspaceService } from "../../../services/workspace.service"

/**
 * Set the properties of a board
 */
export function handleSetBoardProperties(
  payload: ExtractPayload<"set_board_properties">,
  workspace: Workspace,
): Workspace {
  // Default merging to true

  if (rules.mutations.setProperties.board.allowed === false) {
    return workspace
  }

  return workspaceService.setBoardProperties(
    payload.componentId,
    payload.properties,
    workspace,
  )
}
