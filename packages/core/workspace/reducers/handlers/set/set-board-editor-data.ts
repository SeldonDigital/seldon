import { withBoardMutation } from "../../../services/shared/workspace-operation-helpers"

import type { ExtractPayload, Workspace } from "../../../../index"

/**
 * Sets or clears `workspace.boards[boardKey].__editor`.
 */
export function setBoardEditorData(
  payload: ExtractPayload<"set_board_editor_data">,
  workspace: Workspace,
): Workspace {
  return withBoardMutation(payload.boardKey, workspace, (board) => {
    if (payload.editorData === undefined) delete board.__editor
    else board.__editor = payload.editorData
  })
}
