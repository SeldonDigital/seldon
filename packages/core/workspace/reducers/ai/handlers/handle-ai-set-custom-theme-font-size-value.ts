import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeFontSizeValue } from "../../core/handlers/handle-set-custom-theme-font-size-value"

export function handleAiSetCustomThemeFontSizeValue(
  payload: ExtractPayload<"ai_set_custom_theme_font_size_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeFontSizeValue(payload, workspace)
}
