import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set the default icon size value in the icon section of the custom theme
 *
 * @param payload Contains the default icon size value to set
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme default icon size
 */
export function handleSetCustomThemeDefaultIconSize(
  payload: ExtractPayload<"set_custom_theme_default_icon_size">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.icon.defaultSize = payload.value
  })
}
