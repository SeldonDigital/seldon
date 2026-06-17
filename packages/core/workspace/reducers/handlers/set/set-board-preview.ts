import type { ExtractPayload, Workspace } from "../../../../index"
import { withBoardMutation } from "../../../services/shared/workspace-operation-helpers"

/**
 * Sets `workspace.boards[boardKey].componentPreview` on theme and resource catalog boards.
 */
export function setBoardPreview(
  payload: ExtractPayload<"set_board_preview">,
  workspace: Workspace,
): Workspace {
  return withBoardMutation(payload.boardKey, workspace, (board) => {
    if (
      board.type === "theme" ||
      board.type === "font-collection" ||
      board.type === "icon-set" ||
      board.type === "media"
    ) {
      board.componentPreview = payload.preview
    }
  })
}
