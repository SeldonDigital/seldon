import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeDefaultIconSize } from "../../core/handlers/handle-set-custom-theme-default-icon-size"

/**
 * Set the default icon size value in the icon section of the custom theme
 *
 * @param payload Contains the default icon size value to set
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme default icon size
 */
export function handleAiSetCustomThemeDefaultIconSize(
  payload: ExtractPayload<"ai_set_custom_theme_default_icon_size">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeDefaultIconSize(payload, workspace)
}
