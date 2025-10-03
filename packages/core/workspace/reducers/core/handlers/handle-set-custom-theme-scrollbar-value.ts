import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the scrollbar section of the custom theme
 *
 * @param payload Contains the key and value to set in the scrollbar section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme scrollbar section
 */
export function handleSetCustomThemeScrollbarValue(
  payload: ExtractPayload<"set_custom_theme_scrollbar_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.scrollbar[payload.key].parameters = {
      ...draft.customTheme.scrollbar[payload.key].parameters,
      ...payload.value,
    }
  })
}
