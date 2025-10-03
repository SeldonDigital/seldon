import { ExtractPayload, Workspace } from "../../../types"
import { handleAddCustomThemeSwatch } from "../../core/handlers/handle-add-custom-theme-swatch"

export function handleAiAddCustomThemeSwatch(
  payload: ExtractPayload<"ai_add_custom_theme_swatch">,
  workspace: Workspace,
): Workspace {
  return handleAddCustomThemeSwatch(payload, workspace)
}
