import { rules } from "../../../../rules/config/rules.config"
import { nodeOperationsService } from "../../../services"
import type { ExtractPayload, Workspace } from "../../../../index"

/**
 * Removes any board by its key after the delete rule gate. Routes component,
 * authored, resource, and playground boards through
 * {@link nodeOperationsService.deleteBoardByKey}, which resolves the board type.
 */
export function removeBoard(
  payload: ExtractPayload<"remove_board">,
  workspace: Workspace,
): Workspace {
  if (rules.mutations.delete.board.allowed === false) {
    return workspace
  }

  return nodeOperationsService.deleteBoardByKey(payload.boardKey, workspace)
}
