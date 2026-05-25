import type { ExtractPayload, Workspace } from "../../../../index"
import { withComponentMutation } from "../../../services/shared/workspace-operation-helpers"

export function resetComponentPreview(
  payload: ExtractPayload<"reset_component_preview">,
  workspace: Workspace,
): Workspace {
  return withComponentMutation(payload.componentKey, workspace, (board) => {
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
