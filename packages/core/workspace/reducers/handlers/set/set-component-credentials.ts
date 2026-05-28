import type { ExtractPayload, Workspace } from "../../../../index"
import { withComponentMutation } from "../../../services/shared/workspace-operation-helpers"

/**
 * Sets or clears `workspace.components[componentKey].credentials` on resource catalog boards.
 */
export function setComponentCredentials(
  payload: ExtractPayload<"set_component_credentials">,
  workspace: Workspace,
): Workspace {
  return withComponentMutation(payload.componentKey, workspace, (board) => {
    if (
      board.type === "font-collection" ||
      board.type === "icon-set" ||
      board.type === "media"
    ) {
      if (payload.credentials === undefined) delete board.credentials
      else board.credentials = payload.credentials
    }
  })
}
