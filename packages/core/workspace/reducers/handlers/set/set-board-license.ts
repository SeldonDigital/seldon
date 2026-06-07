import type { ExtractPayload, Workspace } from "../../../../index"
import { withBoardMutation } from "../../../services/shared/workspace-operation-helpers"

/**
 * Sets or clears `workspace.boards[boardKey].license` where that field exists on the board kind.
 */
export function setBoardLicense(
  payload: ExtractPayload<"set_board_license">,
  workspace: Workspace,
): Workspace {
  return withBoardMutation(payload.boardKey, workspace, (board) => {
    switch (board.type) {
      case "component":
      case "theme":
      case "font-collection":
      case "icon-set":
      case "media":
        if (payload.license === undefined) delete board.license
        else board.license = payload.license
        break
      default:
        break
    }
  })
}
