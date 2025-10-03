import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeSizeValue } from "../../core/handlers/handle-set-custom-theme-size-value"

export function handleAiSetCustomThemeSizeValue(
  payload: ExtractPayload<"ai_set_custom_theme_size_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeSizeValue(payload, workspace)
}
