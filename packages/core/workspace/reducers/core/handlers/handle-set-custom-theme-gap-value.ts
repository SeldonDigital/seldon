import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the gap section of the custom theme
 *
 * @param payload Contains the key and value to set in the gap section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme gap section
 */
export function handleSetCustomThemeGapValue(
  payload: ExtractPayload<"set_custom_theme_gap_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.gap[payload.key].parameters = {
      ...draft.customTheme.gap[payload.key].parameters,
      ...payload.value,
    }
  })
}
