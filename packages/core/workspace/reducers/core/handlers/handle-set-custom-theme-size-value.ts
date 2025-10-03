import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the size section of the custom theme
 *
 * @param payload Contains the key and value to set in the size section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme size section
 */
export function handleSetCustomThemeSizeValue(
  payload: ExtractPayload<"set_custom_theme_size_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.size[payload.key].parameters = {
      ...draft.customTheme.size[payload.key].parameters,
      ...payload.value,
    }
  })
}
