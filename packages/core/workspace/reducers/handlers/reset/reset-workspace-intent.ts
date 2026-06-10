import { produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"

export function resetWorkspaceIntent(
  _payload: ExtractPayload<"reset_workspace_intent">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    delete draft.metadata.intent
  })
}
