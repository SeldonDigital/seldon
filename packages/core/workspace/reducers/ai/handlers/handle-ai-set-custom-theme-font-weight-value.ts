import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeFontWeightValue } from "../../core/handlers/handle-set-custom-theme-font-weight-value"

export function handleAiSetCustomThemeFontWeightValue(
  payload: ExtractPayload<"ai_set_custom_theme_font_weight_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeFontWeightValue(payload, workspace)
}
