import type { ExtractPayload, Workspace } from "../../../../index"
import { withBoardMutation } from "../../../services/shared/workspace-operation-helpers"

/**
 * Sets `workspace.boards[boardKey].author` on component and theme boards.
 */
export function setBoardAuthor(
  payload: ExtractPayload<"set_board_author">,
  workspace: Workspace,
): Workspace {
  return withBoardMutation(payload.boardKey, workspace, (board) => {
    if (board.type === "component" || board.type === "theme") {
      board.author = payload.author
    }
  })
}
