import { produce } from "immer"
import { computeTheme } from "../../../../themes/helpers/compute-theme"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the color section of the custom theme (excluding baseColor and harmony)
 *
 * @param payload Contains the key and value to set in the color section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme color section
 */
export function handleSetCustomThemeColorValue(
  payload: ExtractPayload<"set_custom_theme_color_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.color[payload.key] = payload.value

    // Recompute the theme to ensure all dynamic colors are recalculated
    draft.customTheme = computeTheme(draft.customTheme)
  })
}
