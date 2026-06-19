import { produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"
import { isReservedStateName } from "../../../model/node-state"

/**
 * Registers a workspace-wide custom interaction state. No-ops when the key
 * collides with a reserved name or an existing custom state. Entries carry a
 * name and label only, with no render data.
 */
export function addCustomState(
  payload: ExtractPayload<"add_custom_state">,
  workspace: Workspace,
): Workspace {
  if (isReservedStateName(payload.key)) return workspace

  return produce(workspace, (draft) => {
    const customStates = draft.metadata.customStates ?? []
    if (customStates.some((state) => state.key === payload.key)) return
    customStates.push({
      key: payload.key,
      label: payload.label,
      ...(payload.description !== undefined
        ? { description: payload.description }
        : {}),
    })
    draft.metadata.customStates = customStates
  })
}
