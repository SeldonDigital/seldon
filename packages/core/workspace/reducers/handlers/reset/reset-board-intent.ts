import { withBoardMutation } from "../../../services/shared/workspace-operation-helpers"

import type { ExtractPayload, Workspace } from "../../../../index"

export function resetBoardIntent(
  payload: ExtractPayload<"reset_board_intent">,
  workspace: Workspace,
): Workspace {
  return withBoardMutation(payload.boardKey, workspace, (board) => {
    delete board.intent
  })
}
