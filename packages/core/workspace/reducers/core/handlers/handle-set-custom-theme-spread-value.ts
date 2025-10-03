import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the spread section of the custom theme
 *
 * @param payload Contains the key and value to set in the spread section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme spread section
 */
export function handleSetCustomThemeSpreadValue(
  payload: ExtractPayload<"set_custom_theme_spread_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.spread[payload.key].parameters = {
      ...draft.customTheme.spread[payload.key].parameters,
      ...payload.value,
    }
  })
}
