import { produce } from "immer"
import type { ExtractPayload, Workspace } from "../../../../index"

/**
 * Sets or clears `workspace.metadata.license`.
 */
export function setWorkspaceLicense(
  payload: ExtractPayload<"set_workspace_license">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    if (payload.value === undefined) delete draft.metadata.license
    else draft.metadata.license = payload.value
  })
}
