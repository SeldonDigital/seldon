import { produce } from "immer"
import { computeTheme } from "../../../../themes/helpers/compute-theme"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set the harmony value in the color section of the custom theme
 *
 * @param payload Contains the harmony value to set
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme harmony
 */
export function handleSetCustomThemeHarmony(
  payload: ExtractPayload<"set_custom_theme_harmony">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.color.harmony = payload.value

    draft.customTheme = computeTheme(draft.customTheme)
  })
}
