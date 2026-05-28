import type { ExtractPayload, Workspace } from "../../../../index"
import { withComponentMutation } from "../../../services/shared/workspace-operation-helpers"

/**
 * Sets `workspace.components[componentKey].author` on component and theme boards.
 */
export function setComponentAuthor(
  payload: ExtractPayload<"set_component_author">,
  workspace: Workspace,
): Workspace {
  return withComponentMutation(payload.componentKey, workspace, (board) => {
    if (board.type === "component" || board.type === "theme") {
      board.author = payload.author
    }
  })
}
