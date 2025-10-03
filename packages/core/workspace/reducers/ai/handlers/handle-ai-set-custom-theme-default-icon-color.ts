import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeDefaultIconColor } from "../../core/handlers/handle-set-custom-theme-default-icon-color"

/**
 * Set the default icon color value in the icon section of the custom theme
 *
 * @param payload Contains the default icon color value to set
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme default icon color
 */
export function handleAiSetCustomThemeDefaultIconColor(
  payload: ExtractPayload<"ai_set_custom_theme_default_icon_color">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeDefaultIconColor(payload, workspace)
}
