import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set the size value in the core section of the custom theme
 *
 * @param payload Contains the size value to set
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme core size
 */
export function handleSetCustomThemeCoreSize(
  payload: ExtractPayload<"set_custom_theme_core_size">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.core.size = payload.value
  })
}
