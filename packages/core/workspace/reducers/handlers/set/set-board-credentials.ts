import type { ExtractPayload, Workspace } from "../../../../index"
import { withBoardMutation } from "../../../services/shared/workspace-operation-helpers"

/**
 * Sets or clears `workspace.components[boardKey].credentials` on resource catalog boards.
 */
export function setBoardCredentials(
  payload: ExtractPayload<"set_board_credentials">,
  workspace: Workspace,
): Workspace {
  return withBoardMutation(payload.boardKey, workspace, (board) => {
    if (
      board.type === "font-collection" ||
      board.type === "icon-set" ||
      board.type === "media"
    ) {
      if (payload.credentials === undefined) delete board.credentials
      else board.credentials = payload.credentials
    }
  })
}
