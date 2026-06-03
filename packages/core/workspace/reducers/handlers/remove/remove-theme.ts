import { ExtractPayload, Workspace } from "../../../../index"
import { applyComponentKeyDeletion } from "./remove-component-catalog"

/**
 * Removes a theme board and its `themes` entries. Validation keeps the default
 * Seldon theme board, which every workspace requires.
 */
export function removeTheme(
  payload: ExtractPayload<"remove_theme">,
  workspace: Workspace,
): Workspace {
  return applyComponentKeyDeletion(payload.componentKey, workspace)
}
