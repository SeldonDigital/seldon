import { ExtractPayload, Workspace } from "../../../../index"
import { removeBoardByKey } from "./remove-board-by-key"

/**
 * Removes an icon set catalog board and its rows. Validation blocks removal of
 * the default Seldon icon set board.
 */
export function removeIconSet(
  payload: ExtractPayload<"remove_icon_set">,
  workspace: Workspace,
): Workspace {
  return removeBoardByKey(payload.catalogId, workspace)
}
