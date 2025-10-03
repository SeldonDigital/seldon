import { produce } from "immer"
import { computeTheme } from "../../../../themes/helpers/compute-theme"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set the base color value in the color section of the custom theme
 *
 * @param payload Contains the base color value to set
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme base color
 */
export function handleSetCustomThemeBaseColor(
  payload: ExtractPayload<"set_custom_theme_base_color">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.color.baseColor = payload.value

    // Recompute the theme to ensure all dynamic colors are recalculated
    draft.customTheme = computeTheme(draft.customTheme)
  })
}
