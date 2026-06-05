import { ExtractPayload, Workspace } from "../../../../index"
import { applyComponentKeyDeletion } from "./remove-component-catalog"

/**
 * Removes an icon set catalog board and its rows. Validation blocks removal of
 * the default Seldon icon set board.
 */
export function removeIconSet(
  payload: ExtractPayload<"remove_icon_set">,
  workspace: Workspace,
): Workspace {
  return applyComponentKeyDeletion(payload.catalogId, workspace)
}
