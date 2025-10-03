import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the fontWeight section of the custom theme
 *
 * @param payload Contains the key and value to set in the fontWeight section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme fontWeight section
 */
export function handleSetCustomThemeFontWeightValue(
  payload: ExtractPayload<"set_custom_theme_font_weight_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.fontWeight[payload.key].value = payload.value
  })
}
