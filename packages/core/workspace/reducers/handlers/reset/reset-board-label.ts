import type { ExtractPayload, Workspace } from "../../../../index"
import { getDefaultBoardLabel } from "../../../helpers/components/default-board-metadata"
import { withBoardMutation } from "../../../services/shared/workspace-operation-helpers"

export function resetBoardLabel(
  payload: ExtractPayload<"reset_board_label">,
  workspace: Workspace,
): Workspace {
  return withBoardMutation(payload.boardKey, workspace, (board) => {
    board.label = getDefaultBoardLabel(payload.boardKey, board)
  })
}
