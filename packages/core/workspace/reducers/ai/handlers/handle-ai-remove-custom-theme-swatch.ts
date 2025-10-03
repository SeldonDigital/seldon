import { ExtractPayload, Workspace } from "../../../types"
import { handleRemoveCustomThemeSwatch } from "../../core/handlers/handle-remove-custom-theme-swatch"

export function handleAiRemoveCustomThemeSwatch(
  payload: ExtractPayload<"ai_remove_custom_theme_swatch">,
  workspace: Workspace,
): Workspace {
  return handleRemoveCustomThemeSwatch(payload, workspace)
}
