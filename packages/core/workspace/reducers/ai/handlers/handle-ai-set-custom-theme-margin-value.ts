import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeMarginValue } from "../../core/handlers/handle-set-custom-theme-margin-value"

export function handleAiSetCustomThemeMarginValue(
  payload: ExtractPayload<"ai_set_custom_theme_margin_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeMarginValue(payload, workspace)
}
