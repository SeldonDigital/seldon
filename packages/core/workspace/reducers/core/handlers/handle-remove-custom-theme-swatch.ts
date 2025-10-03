import { produce } from "immer"
import { themeService } from "../../../services/theme.service"
import { workspaceService } from "../../../services/workspace.service"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Remove a custom swatch from the custom theme
 *
 * @param payload Contains the section, key and value to set
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme
 */
export function handleRemoveCustomThemeSwatch(
  payload: ExtractPayload<"remove_custom_theme_swatch">,
  workspace: Workspace,
): Workspace {
  const theme = themeService.getTheme("custom", workspace)
  const workspaceWithoutSwatchValue =
    workspaceService.migrateSwatchToExactValue(
      theme,
      `@swatch.${payload.key}`,
      workspace,
    )

  return produce(workspaceWithoutSwatchValue, (draft) => {
    draft = workspaceService.migrateSwatchToExactValue(
      theme,
      `@swatch.${payload.key}`,
      draft,
    )
    delete draft.customTheme.swatch[payload.key]
  })
}
