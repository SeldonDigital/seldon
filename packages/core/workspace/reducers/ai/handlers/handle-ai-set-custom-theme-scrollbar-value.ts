import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeScrollbarValue } from "../../core/handlers/handle-set-custom-theme-scrollbar-value"

export function handleAiSetCustomThemeScrollbarValue(
  payload: ExtractPayload<"ai_set_custom_theme_scrollbar_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeScrollbarValue(payload, workspace)
}
