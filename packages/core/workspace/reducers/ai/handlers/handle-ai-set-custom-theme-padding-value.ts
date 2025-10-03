import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemePaddingValue } from "../../core/handlers/handle-set-custom-theme-padding-value"

export function handleAiSetCustomThemePaddingValue(
  payload: ExtractPayload<"ai_set_custom_theme_padding_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemePaddingValue(payload, workspace)
}
