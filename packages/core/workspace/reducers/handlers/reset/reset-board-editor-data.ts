import type { ExtractPayload, Workspace } from "../../../../index"
import { withBoardMutation } from "../../../services/shared/workspace-operation-helpers"

export function resetBoardEditorData(
  payload: ExtractPayload<"reset_board_editor_data">,
  workspace: Workspace,
): Workspace {
  return withBoardMutation(payload.boardKey, workspace, (board) => {
    delete board.__editor
  })
}
