import { withBoardMutation } from "../../../services/shared/workspace-operation-helpers"

import type { ExtractPayload, Workspace } from "../../../../index"

/**
 * Sets or clears `workspace.boards[boardKey].intent`.
 */
export function setBoardIntent(
  payload: ExtractPayload<"set_board_intent">,
  workspace: Workspace,
): Workspace {
  return withBoardMutation(payload.boardKey, workspace, (board) => {
    if (payload.intent === undefined) delete board.intent
    else board.intent = payload.intent
  })
}
