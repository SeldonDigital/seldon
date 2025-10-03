import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the margin section of the custom theme
 *
 * @param payload Contains the key and value to set in the margin section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme margin section
 */
export function handleSetCustomThemeMarginValue(
  payload: ExtractPayload<"set_custom_theme_margin_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.margin[payload.key].parameters = {
      ...draft.customTheme.margin[payload.key].parameters,
      ...payload.value,
    }
  })
}
