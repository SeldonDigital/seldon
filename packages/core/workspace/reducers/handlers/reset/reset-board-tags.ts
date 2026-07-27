import { withBoardMutation } from "../../../services/shared/workspace-operation-helpers"

import type { ExtractPayload, Workspace } from "../../../../index"

export function resetBoardTags(
  payload: ExtractPayload<"reset_board_tags">,
  workspace: Workspace,
): Workspace {
  return withBoardMutation(payload.boardKey, workspace, (board) => {
    delete board.tags
  })
}
