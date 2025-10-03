import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeCornersValue } from "../../core/handlers/handle-set-custom-theme-corners-value"

export function handleAiSetCustomThemeCornersValue(
  payload: ExtractPayload<"ai_set_custom_theme_corners_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeCornersValue(payload, workspace)
}
