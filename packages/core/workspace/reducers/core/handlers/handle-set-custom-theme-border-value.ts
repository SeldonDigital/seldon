import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the border section of the custom theme
 *
 * @param payload Contains the key and value to set in the border section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme border section
 */
export function handleSetCustomThemeBorderValue(
  payload: ExtractPayload<"set_custom_theme_border_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.border[payload.key].parameters = {
      ...draft.customTheme.border[payload.key].parameters,
      ...payload.value,
    }
  })
}
