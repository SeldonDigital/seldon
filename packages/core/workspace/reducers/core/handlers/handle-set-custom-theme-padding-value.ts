import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the padding section of the custom theme
 *
 * @param payload Contains the key and value to set in the padding section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme padding section
 */
export function handleSetCustomThemePaddingValue(
  payload: ExtractPayload<"set_custom_theme_padding_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.padding[payload.key].parameters = {
      ...draft.customTheme.padding[payload.key].parameters,
      ...payload.value,
    }
  })
}
