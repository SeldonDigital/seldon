import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeFontFamilyValue } from "../../core/handlers/handle-set-custom-theme-font-family-value"

/**
 * Set a value in the fontFamily section of the custom theme
 *
 * @param payload Contains the key and value to set in the fontFamily section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme core size
 */
export function handleAiSetCustomThemeFontFamilyValue(
  payload: ExtractPayload<"ai_set_custom_theme_font_family_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeFontFamilyValue(payload, workspace)
}
