import { produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"

/**
 * Sets `workspace.metadata.version`.
 */
export function setWorkspaceVersion(
  payload: ExtractPayload<"set_workspace_version">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.metadata.version = payload.value
  })
}
