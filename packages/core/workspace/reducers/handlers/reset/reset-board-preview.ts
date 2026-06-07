import type { ExtractPayload, Workspace } from "../../../../index"
import { withBoardMutation } from "../../../services/shared/workspace-operation-helpers"

export function resetBoardPreview(
  payload: ExtractPayload<"reset_board_preview">,
  workspace: Workspace,
): Workspace {
  return withBoardMutation(payload.boardKey, workspace, (board) => {
    if (board.type === "theme") {
      board.componentPreview = "seldonThemePreview"
      return
    }
    if (board.type === "font-collection") {
      board.componentPreview = "seldonFontsPreview"
      return
    }
    if (board.type === "icon-set") {
      board.componentPreview = "seldonIconsPreview"
      return
    }
    if (board.type === "media") {
      board.componentPreview = "seldonMediaPreview"
    }
  })
}
