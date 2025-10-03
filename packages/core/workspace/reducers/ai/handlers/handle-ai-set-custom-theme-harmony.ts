import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeHarmony } from "../../core/handlers/handle-set-custom-theme-harmony"

/**
 * Set the harmony value in the color section of the custom theme
 *
 * @param payload Contains the harmony value to set
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme harmony
 */
export function handleAiSetCustomThemeHarmony(
  payload: ExtractPayload<"ai_set_custom_theme_harmony">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeHarmony(payload, workspace)
}
