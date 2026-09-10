import { produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"

/**
 * Merges export settings into `workspace.metadata.exportSettings`, so a caller
 * may send only the fields it changes. Passing `undefined` clears the whole
 * block. The next load fills missing fields from the shared defaults.
 */
export function setWorkspaceExportSettings(
  payload: ExtractPayload<"set_workspace_export_settings">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    if (payload.value === undefined) {
      delete draft.metadata.exportSettings

      return
    }

    draft.metadata.exportSettings = {
      ...draft.metadata.exportSettings,
      ...payload.value,
    }
  })
}
