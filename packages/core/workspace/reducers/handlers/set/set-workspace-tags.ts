import { produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"

/**
 * Sets or clears `workspace.metadata.tags`.
 */
export function setWorkspaceTags(
  payload: ExtractPayload<"set_workspace_tags">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    if (payload.value === undefined) delete draft.metadata.tags
    else draft.metadata.tags = payload.value
  })
}
