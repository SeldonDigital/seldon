import type { ExtractPayload, Workspace } from "../../../../index"
import { withComponentMutation } from "../../../services/shared/workspace-operation-helpers"

export function resetComponentEditorData(
  payload: ExtractPayload<"reset_component_editor_data">,
  workspace: Workspace,
): Workspace {
  return withComponentMutation(payload.componentKey, workspace, (board) => {
    delete board.__editor
  })
}
