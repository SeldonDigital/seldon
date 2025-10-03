import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set the default icon color value in the icon section of the custom theme
 *
 * @param payload Contains the default icon color value to set
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme default icon color
 */
export function handleSetCustomThemeDefaultIconColor(
  payload: ExtractPayload<"set_custom_theme_default_icon_color">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.icon.defaultColor = payload.value
  })
}
