import type { ExtractPayload, Workspace } from "../../../../index"
import { withComponentMutation } from "../../../services/shared/workspace-operation-helpers"

/**
 * Sets or clears `workspace.components[componentKey].license` where that field exists on the board kind.
 */
export function setComponentLicense(
  payload: ExtractPayload<"set_component_license">,
  workspace: Workspace,
): Workspace {
  return withComponentMutation(payload.componentKey, workspace, (board) => {
    switch (board.type) {
      case "component":
      case "theme":
      case "font-collection":
      case "icon-set":
      case "media":
        if (payload.license === undefined) delete board.license
        else board.license = payload.license
        break
      default:
        break
    }
  })
}
