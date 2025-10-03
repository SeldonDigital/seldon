import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the blur section of the custom theme
 *
 * @param payload Contains the key and value to set in the blur section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme blur section
 */
export function handleSetCustomThemeBlurValue(
  payload: ExtractPayload<"set_custom_theme_blur_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.blur[payload.key].parameters = {
      ...draft.customTheme.blur[payload.key].parameters,
      ...payload.value,
    }
  })
}
