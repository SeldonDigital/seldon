import type { ExtractPayload, Workspace } from "../../../../index"
import { DEFAULT_THEME_COMPONENT_AUTHOR } from "../../../helpers/components/default-component-metadata"
import { withComponentMutation } from "../../../services/shared/workspace-operation-helpers"

export function resetComponentAuthor(
  payload: ExtractPayload<"reset_component_author">,
  workspace: Workspace,
): Workspace {
  return withComponentMutation(payload.componentKey, workspace, (board) => {
    if (board.type === "component" || board.type === "theme") {
      board.author = DEFAULT_THEME_COMPONENT_AUTHOR
    }
  })
}
