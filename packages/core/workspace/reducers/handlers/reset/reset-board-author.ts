import type { ExtractPayload, Workspace } from "../../../../index"
import { DEFAULT_THEME_BOARD_AUTHOR } from "../../../helpers/components/default-board-metadata"
import { withBoardMutation } from "../../../services/shared/workspace-operation-helpers"

export function resetBoardAuthor(
  payload: ExtractPayload<"reset_board_author">,
  workspace: Workspace,
): Workspace {
  return withBoardMutation(payload.boardKey, workspace, (board) => {
    if (board.type === "component" || board.type === "theme") {
      board.author = DEFAULT_THEME_BOARD_AUTHOR
    }
  })
}
