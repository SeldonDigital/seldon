import { produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"
import { invariant } from "../../../../index"
import { ErrorMessages } from "../../../constants"

/**
 * Sets `workspace.playgrounds[playgroundKey].label`.
 */
export function setPlaygroundLabel(
  payload: ExtractPayload<"set_playground_label">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const playground = draft.playgrounds[payload.playgroundKey]
    invariant(
      playground,
      ErrorMessages.componentNotFound(payload.playgroundKey),
    )
    playground.label = payload.label
  })
}
