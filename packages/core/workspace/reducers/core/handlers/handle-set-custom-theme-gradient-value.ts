import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the gradient section of the custom theme
 *
 * @param payload Contains the key and value to set in the gradient section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme gradient section
 */
export function handleSetCustomThemeGradientValue(
  payload: ExtractPayload<"set_custom_theme_gradient_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.gradient[payload.key].parameters = {
      ...draft.customTheme.gradient[payload.key].parameters,
      ...payload.value,
    }
  })
}
