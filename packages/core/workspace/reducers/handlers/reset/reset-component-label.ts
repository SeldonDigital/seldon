import type { ExtractPayload, Workspace } from "../../../../index"
import { getDefaultComponentLabel } from "../../../helpers/components/default-component-metadata"
import { withComponentMutation } from "../../../services/shared/workspace-operation-helpers"

export function resetComponentLabel(
  payload: ExtractPayload<"reset_component_label">,
  workspace: Workspace,
): Workspace {
  return withComponentMutation(payload.componentKey, workspace, (board) => {
    board.label = getDefaultComponentLabel(payload.componentKey, board)
  })
}
