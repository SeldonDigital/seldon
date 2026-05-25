import { produce } from "immer"
import type { ExtractPayload, Workspace } from "../../../../index"

/**
 * Sets or clears `workspace.metadata.label`.
 */
export function setWorkspaceLabel(
  payload: ExtractPayload<"set_workspace_label">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    if (payload.value === undefined) delete draft.metadata.label
    else draft.metadata.label = payload.value
  })
}
