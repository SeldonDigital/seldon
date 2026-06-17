import { produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"

export function resetWorkspaceLabel(
  _payload: ExtractPayload<"reset_workspace_label">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    delete draft.metadata.label
  })
}
