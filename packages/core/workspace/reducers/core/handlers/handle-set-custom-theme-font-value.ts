import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the font section of the custom theme
 *
 * @param payload Contains the key and value to set in the font section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme font section
 */
export function handleSetCustomThemeFontValue(
  payload: ExtractPayload<"set_custom_theme_font_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.font[payload.key].parameters = {
      ...draft.customTheme.font[payload.key].parameters,
      ...payload.value,
    }
  })
}
