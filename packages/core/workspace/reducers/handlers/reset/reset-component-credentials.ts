import type { ExtractPayload, Workspace } from "../../../../index"
import { withComponentMutation } from "../../../services/shared/workspace-operation-helpers"

export function resetComponentCredentials(
  payload: ExtractPayload<"reset_component_credentials">,
  workspace: Workspace,
): Workspace {
  return withComponentMutation(payload.componentKey, workspace, (board) => {
    if (
      board.type === "font-collection" ||
      board.type === "icon-set" ||
      board.type === "media"
    ) {
      delete board.credentials
    }
  })
}
