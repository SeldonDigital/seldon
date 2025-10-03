import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the background section of the custom theme
 *
 * @param payload Contains the key and value to set in the background section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme background section
 */
export function handleSetCustomThemeBackgroundValue(
  payload: ExtractPayload<"set_custom_theme_background_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.background[payload.key].parameters = {
      ...draft.customTheme.background[payload.key].parameters,
      ...payload.value,
    }
  })
}
