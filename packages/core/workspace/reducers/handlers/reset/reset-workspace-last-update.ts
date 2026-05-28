import { produce } from "immer"
import type { ExtractPayload, Workspace } from "../../../../index"

export function resetWorkspaceLastUpdate(
  _payload: ExtractPayload<"reset_workspace_last_update">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    delete draft.metadata.lastUpdate
  })
}
