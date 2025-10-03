import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set the ratio value in the core section of the custom theme
 *
 * @param payload Contains the ratio value to set
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme core ratio
 */
export function handleSetCustomThemeCoreRatio(
  payload: ExtractPayload<"set_custom_theme_core_ratio">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.core.ratio = payload.value
  })
}
