import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeFontValue } from "../../core/handlers/handle-set-custom-theme-font-value"

export function handleAiSetCustomThemeFontValue(
  payload: ExtractPayload<"ai_set_custom_theme_font_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeFontValue(payload, workspace)
}
