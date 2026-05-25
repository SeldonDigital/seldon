import type { ExtractPayload, Workspace } from "../../../../index"
import { withComponentMutation } from "../../../services/shared/workspace-operation-helpers"

/**
 * Sets or clears `workspace.components[componentKey].__editor`.
 */
export function setComponentEditorData(
  payload: ExtractPayload<"set_component_editor_data">,
  workspace: Workspace,
): Workspace {
  return withComponentMutation(payload.componentKey, workspace, (board) => {
    if (payload.editorData === undefined) delete board.__editor
    else board.__editor = payload.editorData
  })
}
