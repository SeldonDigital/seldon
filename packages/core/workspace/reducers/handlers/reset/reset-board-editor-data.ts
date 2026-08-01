import { boardOrderService } from "../../../services"
import { withBoardMutation } from "../../../services/shared/workspace-operation-helpers"

import type { ExtractPayload, Workspace } from "../../../../index"

/**
 * Clears a board's editor data. The board sort index lives there, so the order
 * is re-derived through the same service every other board mutation uses,
 * rather than reading as 0 and sending the board to the top of the list.
 */
export function resetBoardEditorData(
  payload: ExtractPayload<"reset_board_editor_data">,
  workspace: Workspace,
): Workspace {
  const next = withBoardMutation(payload.boardKey, workspace, (board) => {
    delete board.__editor
  })

  return boardOrderService.realignBoardOrder(next)
}
