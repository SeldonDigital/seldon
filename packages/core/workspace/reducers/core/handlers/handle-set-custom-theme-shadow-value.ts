import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the shadow section of the custom theme
 *
 * @param payload Contains the key and value to set in the shadow section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme shadow section
 */
export function handleSetCustomThemeShadowValue(
  payload: ExtractPayload<"set_custom_theme_shadow_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.shadow[payload.key].parameters = {
      ...draft.customTheme.shadow[payload.key].parameters,
      ...payload.value,
    }
  })
}
