import { produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"

/**
 * Sets or clears `workspace.metadata.lastUpdate`.
 */
export function setWorkspaceLastUpdate(
  payload: ExtractPayload<"set_workspace_last_update">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    if (payload.value === undefined) delete draft.metadata.lastUpdate
    else draft.metadata.lastUpdate = payload.value
  })
}
