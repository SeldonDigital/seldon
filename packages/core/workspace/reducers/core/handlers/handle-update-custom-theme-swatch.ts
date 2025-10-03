import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Update a custom swatch value in the custom theme
 *
 * @param payload Contains the section, key and value to set
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme
 */
export function handleUpdateCustomThemeSwatch(
  payload: ExtractPayload<"update_custom_theme_swatch">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const swatch = draft.customTheme.swatch[payload.key]

    if (payload.name) swatch.name = payload.name
    if (payload.intent) swatch.intent = payload.intent
    if (payload.value) swatch.value = payload.value
  })
}
