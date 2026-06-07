import { ExtractPayload, Workspace } from "../../../../index"
import { removeBoardByKey } from "./remove-board-by-key"

/**
 * Removes a theme board and its `themes` entries. Validation keeps the default
 * Seldon theme board, which every workspace requires.
 */
export function removeTheme(
  payload: ExtractPayload<"remove_theme">,
  workspace: Workspace,
): Workspace {
  return removeBoardByKey(payload.boardKey, workspace)
}
