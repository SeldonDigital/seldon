import type { ExtractPayload, Workspace } from "../../../../index"
import { withComponentMutation } from "../../../services/shared/workspace-operation-helpers"

/**
 * Sets or clears `workspace.components[componentKey].intent`.
 */
export function setComponentIntent(
  payload: ExtractPayload<"set_component_intent">,
  workspace: Workspace,
): Workspace {
  return withComponentMutation(payload.componentKey, workspace, (board) => {
    if (payload.intent === undefined) delete board.intent
    else board.intent = payload.intent
  })
}
