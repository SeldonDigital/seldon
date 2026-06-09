import { produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"

export function resetWorkspaceTags(
  _payload: ExtractPayload<"reset_workspace_tags">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    delete draft.metadata.tags
  })
}
