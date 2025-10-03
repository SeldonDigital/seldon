import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeBackgroundValue } from "../../core/handlers/handle-set-custom-theme-background-value"

export function handleAiSetCustomThemeBackgroundValue(
  payload: ExtractPayload<"ai_set_custom_theme_background_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeBackgroundValue(payload, workspace)
}
