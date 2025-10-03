import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeGapValue } from "../../core/handlers/handle-set-custom-theme-gap-value"

export function handleAiSetCustomThemeGapValue(
  payload: ExtractPayload<"ai_set_custom_theme_gap_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeGapValue(payload, workspace)
}
