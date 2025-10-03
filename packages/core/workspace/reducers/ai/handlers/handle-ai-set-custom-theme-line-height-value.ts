import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeLineHeightValue } from "../../core/handlers/handle-set-custom-theme-line-height-value"

export function handleAiSetCustomThemeLineHeightValue(
  payload: ExtractPayload<"ai_set_custom_theme_line_height_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeLineHeightValue(payload, workspace)
}
