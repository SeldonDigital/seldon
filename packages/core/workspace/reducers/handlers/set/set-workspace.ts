import { produce } from "immer"
import { ensureWorkspaceEditableThemeEntry } from "../../../helpers/themes/workspace-editable-theme"
import { ExtractPayload, Workspace } from "../../../../index"

/**
 * Replaces the workspace with `payload.workspace` and ensures the editable theme row exists.
 */
export function setWorkspace(
  payload: ExtractPayload<"set_workspace">,
): Workspace {
  return produce(payload.workspace as Workspace, (draft) => {
    ensureWorkspaceEditableThemeEntry(draft)
  })
}
