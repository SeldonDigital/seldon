import { cloneBoard } from "../../../services"
import type { ExtractPayload, Workspace } from "../../../types"

/**
 * Applies `duplicate_component`: calls `cloneBoard` to copy the source board under the new board key with remapped
 * ids in the right workspace maps. Validation rejects component boards and boards tied
 * to packaged theme, font-collection, icon-set, or media catalog ids.
 */
export function duplicateComponent(
  payload: ExtractPayload<"duplicate_component">,
  workspace: Workspace,
): Workspace {
  return cloneBoard(
    workspace,
    payload.sourceBoardKey,
    payload.newBoardKey,
    payload.label,
  )
}
