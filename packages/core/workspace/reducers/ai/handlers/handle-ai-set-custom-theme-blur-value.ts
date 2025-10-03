import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeBlurValue } from "../../core/handlers/handle-set-custom-theme-blur-value"

export function handleAiSetCustomThemeBlurValue(
  payload: ExtractPayload<"ai_set_custom_theme_blur_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeBlurValue(payload, workspace)
}
