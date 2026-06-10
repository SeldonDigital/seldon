import { produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"

/**
 * Sets or clears `workspace.metadata.owner`.
 */
export function setWorkspaceOwner(
  payload: ExtractPayload<"set_workspace_owner">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    if (payload.value === undefined) delete draft.metadata.owner
    else draft.metadata.owner = payload.value
  })
}
