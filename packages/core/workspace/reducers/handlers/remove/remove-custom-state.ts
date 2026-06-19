import { produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"

/**
 * Removes a workspace custom interaction state from the registry and strips its
 * override bag from every node, keeping the file referentially consistent.
 */
export function removeCustomState(
  payload: ExtractPayload<"remove_custom_state">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const customStates = draft.metadata.customStates
    if (customStates) {
      draft.metadata.customStates = customStates.filter(
        (state) => state.key !== payload.key,
      )
    }

    for (const node of Object.values(draft.nodes)) {
      if (node.states && payload.key in node.states) {
        delete node.states[payload.key]
        if (Object.keys(node.states).length === 0) {
          delete node.states
        }
      }
    }
  })
}
