import { produce } from "immer"
import type { ExtractPayload, Workspace } from "../../../../index"

export function resetWorkspaceLicense(
  _payload: ExtractPayload<"reset_workspace_license">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    delete draft.metadata.license
  })
}
