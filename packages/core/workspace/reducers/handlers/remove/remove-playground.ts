import { rules } from "../../../../rules/config/rules.config"
import { nodeOperationsService } from "../../../services"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Removes a playground container and its Sandbox subtrees. Gated by the board
 * delete rule, mirroring resource and component removal.
 */
export function removePlayground(
  payload: ExtractPayload<"remove_playground">,
  workspace: Workspace,
): Workspace {
  if (rules.mutations.delete.board.allowed === false) {
    return workspace
  }

  return nodeOperationsService.deletePlaygroundByKey(
    payload.boardKey,
    workspace,
  )
}
