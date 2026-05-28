import type { ExtractPayload, Workspace } from "../../../../index"
import { withComponentMutation } from "../../../services/shared/workspace-operation-helpers"

/**
 * Sets `workspace.components[componentKey].componentPreview` on theme and resource catalog boards.
 */
export function setComponentPreview(
  payload: ExtractPayload<"set_component_preview">,
  workspace: Workspace,
): Workspace {
  return withComponentMutation(payload.componentKey, workspace, (board) => {
    if (
      board.type === "theme" ||
      board.type === "font-collection" ||
      board.type === "icon-set" ||
      board.type === "media"
    ) {
      board.componentPreview = payload.componentPreview
    }
  })
}
