import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import { workspaceMutationService } from "../../../services"

/** Copies a board's editor layout properties onto every other component board. */
export function applyComponentPropertiesToAllBoards(
  payload: ExtractPayload<"apply_component_properties_to_all_boards">,
  workspace: Workspace,
): Workspace {
  if (rules.mutations.setProperties.board.allowed === false) {
    return workspace
  }

  return workspaceMutationService.applyComponentPropertiesToAllBoards(
    payload.sourceBoardKey,
    workspace,
  )
}
