import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeBorderWidthValue } from "../../core/handlers/handle-set-custom-theme-border-width-value"

export function handleAiSetCustomThemeBorderWidthValue(
  payload: ExtractPayload<"ai_set_custom_theme_border_width_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeBorderWidthValue(payload, workspace)
}
