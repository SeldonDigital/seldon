import type { ExtractPayload, Workspace } from "../../../../index"
import { withComponentMutation } from "../../../services/shared/workspace-operation-helpers"

/**
 * Sets or clears `workspace.components[componentKey].tags`.
 */
export function setComponentTags(
  payload: ExtractPayload<"set_component_tags">,
  workspace: Workspace,
): Workspace {
  return withComponentMutation(payload.componentKey, workspace, (board) => {
    if (payload.tags === undefined) delete board.tags
    else board.tags = payload.tags
  })
}
