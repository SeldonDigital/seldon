import { ExtractPayload, Workspace } from "../../../types"
import { handleSetCustomThemeDimensionValue } from "../../core/handlers/handle-set-custom-theme-dimension-value"

export function handleAiSetCustomThemeDimensionValue(
  payload: ExtractPayload<"ai_set_custom_theme_dimension_value">,
  workspace: Workspace,
): Workspace {
  return handleSetCustomThemeDimensionValue(payload, workspace)
}
