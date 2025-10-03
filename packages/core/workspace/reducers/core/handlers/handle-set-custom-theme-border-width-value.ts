import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the borderWidth section of the custom theme
 *
 * @param payload Contains the key and value to set in the borderWidth section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme borderWidth section
 */
export function handleSetCustomThemeBorderWidthValue(
  payload: ExtractPayload<"set_custom_theme_border_width_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    if (payload.value === "hairline") {
      draft.customTheme.borderWidth[payload.key] = {
        name: draft.customTheme.borderWidth[payload.key].name,
        value: "hairline",
      }
    } else {
      draft.customTheme.borderWidth[payload.key] = {
        name: draft.customTheme.borderWidth[payload.key].name,
        parameters: payload.value,
      }
    }
  })
}
