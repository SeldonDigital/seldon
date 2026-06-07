import { rules } from "../../../../rules/config/rules.config"
import type { BoardKey, Workspace } from "../../../types"
import { nodeOperationsService } from "../../../services"

/**
 * Deletes a board by its key after the delete rule gate, via
 * {@link nodeOperationsService.deleteBoardByKey}. Shared by the component and
 * resource removal handlers.
 */
export function removeBoardByKey(
  boardKey: BoardKey,
  workspace: Workspace,
): Workspace {
  if (rules.mutations.delete.board.allowed === false) {
    return workspace
  }

  return nodeOperationsService.deleteBoardByKey(boardKey, workspace)
}
