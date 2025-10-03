import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeShadowValue } from "../../core/handlers/handle-set-custom-theme-shadow-value"

export function handleAiSetCustomThemeShadowValue(
  payload: ExtractPayload<"ai_set_custom_theme_shadow_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeShadowValue(payload, workspace)
}
