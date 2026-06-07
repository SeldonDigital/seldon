import type { ExtractPayload, Workspace } from "../../../../index"
import { withBoardMutation } from "../../../services/shared/workspace-operation-helpers"

/**
 * Sets `workspace.boards[boardKey].label`.
 */
export function setBoardLabel(
  payload: ExtractPayload<"set_board_label">,
  workspace: Workspace,
): Workspace {
  return withBoardMutation(payload.boardKey, workspace, (board) => {
    board.label = payload.label
  })
}
