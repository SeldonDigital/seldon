import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeCoreFontSize } from "../../core/handlers/handle-set-custom-theme-core-font-size"

/**
 * Set the font size value in the core section of the custom theme
 *
 * @param payload Contains the font size value to set
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme core font size
 */
export function handleAiSetCustomThemeCoreFontSize(
  payload: ExtractPayload<"ai_set_custom_theme_core_font_size">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeCoreFontSize(payload, workspace)
}
