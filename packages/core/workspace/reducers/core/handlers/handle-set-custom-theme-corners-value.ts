import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the corners section of the custom theme
 *
 * @param payload Contains the key and value to set in the corners section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme corners section
 */
export function handleSetCustomThemeCornersValue(
  payload: ExtractPayload<"set_custom_theme_corners_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.corners[payload.key].parameters = {
      ...draft.customTheme.corners[payload.key].parameters,
      ...payload.value,
    }
  })
}
