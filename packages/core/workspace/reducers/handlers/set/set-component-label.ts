import type { ExtractPayload, Workspace } from "../../../../index"
import { withComponentMutation } from "../../../services/shared/workspace-operation-helpers"

/**
 * Sets `workspace.components[componentKey].label`.
 */
export function setComponentLabel(
  payload: ExtractPayload<"set_component_label">,
  workspace: Workspace,
): Workspace {
  return withComponentMutation(payload.componentKey, workspace, (board) => {
    board.label = payload.label
  })
}
