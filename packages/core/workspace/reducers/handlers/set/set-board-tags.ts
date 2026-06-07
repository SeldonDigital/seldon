import type { ExtractPayload, Workspace } from "../../../../index"
import { withBoardMutation } from "../../../services/shared/workspace-operation-helpers"

/**
 * Sets or clears `workspace.components[boardKey].tags`.
 */
export function setBoardTags(
  payload: ExtractPayload<"set_board_tags">,
  workspace: Workspace,
): Workspace {
  return withBoardMutation(payload.boardKey, workspace, (board) => {
    if (payload.tags === undefined) delete board.tags
    else board.tags = payload.tags
  })
}
