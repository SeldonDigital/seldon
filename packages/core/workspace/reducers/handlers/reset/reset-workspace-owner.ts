import { produce } from "immer"
import type { ExtractPayload, Workspace } from "../../../../index"

export function resetWorkspaceOwner(
  _payload: ExtractPayload<"reset_workspace_owner">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    delete draft.metadata.owner
  })
}
