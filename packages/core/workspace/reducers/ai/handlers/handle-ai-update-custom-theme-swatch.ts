import { ExtractPayload, Workspace } from "../../../types"
import { handleUpdateCustomThemeSwatch } from "../../core/handlers/handle-update-custom-theme-swatch"

export function handleAiUpdateCustomThemeSwatch(
  payload: ExtractPayload<"ai_update_custom_theme_swatch">,
  workspace: Workspace,
): Workspace {
  return handleUpdateCustomThemeSwatch(payload, workspace)
}
