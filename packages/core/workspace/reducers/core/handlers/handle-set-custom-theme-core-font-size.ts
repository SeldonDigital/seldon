import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set the font size value in the core section of the custom theme
 *
 * @param payload Contains the font size value to set
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme core font size
 */
export function handleSetCustomThemeCoreFontSize(
  payload: ExtractPayload<"set_custom_theme_core_font_size">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.core.fontSize = payload.value
  })
}
