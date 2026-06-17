import type { ExtractPayload, Workspace } from "../../../../index"
import { withBoardMutation } from "../../../services/shared/workspace-operation-helpers"

export function resetBoardCredentials(
  payload: ExtractPayload<"reset_board_credentials">,
  workspace: Workspace,
): Workspace {
  return withBoardMutation(payload.boardKey, workspace, (board) => {
    if (
      board.type === "font-collection" ||
      board.type === "icon-set" ||
      board.type === "media"
    ) {
      delete board.credentials
    }
  })
}
