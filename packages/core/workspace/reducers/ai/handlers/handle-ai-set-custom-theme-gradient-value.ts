import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeGradientValue } from "../../core/handlers/handle-set-custom-theme-gradient-value"

export function handleAiSetCustomThemeGradientValue(
  payload: ExtractPayload<"ai_set_custom_theme_gradient_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeGradientValue(payload, workspace)
}
