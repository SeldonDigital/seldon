import { produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"

/**
 * Sets or clears `workspace.metadata.intent`.
 */
export function setWorkspaceIntent(
  payload: ExtractPayload<"set_workspace_intent">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    if (payload.value === undefined) delete draft.metadata.intent
    else draft.metadata.intent = payload.value
  })
}
