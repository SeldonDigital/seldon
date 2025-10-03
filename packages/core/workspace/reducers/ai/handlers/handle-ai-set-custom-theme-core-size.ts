import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeCoreSize } from "../../core/handlers/handle-set-custom-theme-core-size"

/**
 * Set the size value in the core section of the custom theme
 *
 * @param payload Contains the size value to set
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme core size
 */
export function handleAiSetCustomThemeCoreSize(
  payload: ExtractPayload<"ai_set_custom_theme_core_size">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeCoreSize(payload, workspace)
}
