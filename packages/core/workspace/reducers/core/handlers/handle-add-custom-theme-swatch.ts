import { produce } from "immer"
import { themeService } from "../../../services/theme.service"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Add a custom swatch to the custom theme
 *
 * @param payload Contains the section, key and value to set
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme
 */
export function handleAddCustomThemeSwatch(
  payload: ExtractPayload<"add_custom_theme_swatch">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const nextSwatchId = themeService.getNextCustomSwatchId(draft)

    draft.customTheme.swatch[nextSwatchId] = {
      name: payload.name,
      intent: payload.intent,
      type: "hsl",
      value: payload.value,
    }
  })
}
