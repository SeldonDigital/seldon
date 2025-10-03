import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the lineHeight section of the custom theme
 *
 * @param payload Contains the key and value to set in the lineHeight section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme lineHeight section
 */
export function handleSetCustomThemeLineHeightValue(
  payload: ExtractPayload<"set_custom_theme_line_height_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.lineHeight[payload.key].value = payload.value
  })
}
