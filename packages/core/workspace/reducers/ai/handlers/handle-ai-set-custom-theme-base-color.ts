import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeBaseColor } from "../../core/handlers/handle-set-custom-theme-base-color"

/**
 * Set the base color value in the color section of the custom theme
 *
 * @param payload Contains the base color value to set
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme base color
 */
export function handleAiSetCustomThemeBaseColor(
  payload: ExtractPayload<"ai_set_custom_theme_base_color">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeBaseColor(payload, workspace)
}
