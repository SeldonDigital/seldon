import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeColorValue } from "../../core/handlers/handle-set-custom-theme-color-value"

export function handleAiSetCustomThemeColorValue(
  payload: ExtractPayload<"ai_set_custom_theme_color_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeColorValue(payload, workspace)
}
