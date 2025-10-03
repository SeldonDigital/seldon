import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the fontSize section of the custom theme
 *
 * @param payload Contains the key and value to set in the fontSize section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme fontSize section
 */
export function handleSetCustomThemeFontSizeValue(
  payload: ExtractPayload<"set_custom_theme_font_size_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.fontSize[payload.key].parameters = {
      ...draft.customTheme.fontSize[payload.key].parameters,
      ...payload.value,
    }
  })
}
