import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeCoreRatio } from "../../core/handlers/handle-set-custom-theme-core-ratio"

/**
 * Set the ratio value in the core section of the custom theme
 *
 * @param payload Contains the ratio value to set
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme core ratio
 */
export function handleAiSetCustomThemeCoreRatio(
  payload: ExtractPayload<"ai_set_custom_theme_core_ratio">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeCoreRatio(payload, workspace)
}
