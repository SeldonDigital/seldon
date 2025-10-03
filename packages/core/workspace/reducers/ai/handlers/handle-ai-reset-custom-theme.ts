import { ExtractPayload, Workspace } from "../../../types"
import { handleResetCustomTheme } from "../../core/handlers/handle-reset-custom-theme"

export function handleAiResetCustomTheme(
  _payload: ExtractPayload<"ai_reset_custom_theme">,
  workspace: Workspace,
): Workspace {
  return handleResetCustomTheme(_payload, workspace)
}
