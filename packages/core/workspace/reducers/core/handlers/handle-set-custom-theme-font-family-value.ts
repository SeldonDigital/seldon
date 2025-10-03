import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the fontFamily section of the custom theme
 *
 * @param payload Contains the key and value to set in the fontFamily section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme fontFamily section
 */
export function handleSetCustomThemeFontFamilyValue(
  payload: ExtractPayload<"set_custom_theme_font_family_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.fontFamily[payload.key] = payload.value
  })
}
