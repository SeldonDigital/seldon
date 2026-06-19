import { produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"

/**
 * Renames a custom interaction state's display label. The stable `key` is left
 * unchanged, so node `states` references and any derived export bindings hold.
 */
export function renameCustomState(
  payload: ExtractPayload<"rename_custom_state">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.metadata.customStates?.find(
      (state) => state.key === payload.key,
    )
    if (entry) entry.label = payload.label
  })
}
