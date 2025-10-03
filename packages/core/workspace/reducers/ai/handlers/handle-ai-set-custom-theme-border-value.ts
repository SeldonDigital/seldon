import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeBorderValue } from "../../core/handlers/handle-set-custom-theme-border-value"

export function handleAiSetCustomThemeBorderValue(
  payload: ExtractPayload<"ai_set_custom_theme_border_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeBorderValue(payload, workspace)
}
