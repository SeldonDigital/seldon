import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeSpreadValue } from "../../core/handlers/handle-set-custom-theme-spread-value"

export function handleAiSetCustomThemeSpreadValue(
  payload: ExtractPayload<"ai_set_custom_theme_spread_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeSpreadValue(payload, workspace)
}
