import { ThemeInstanceId } from "@seldon/core/themes/types"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"

/**
 * Resolves a theme by its id against the active workspace.
 * @param themeId - The theme entry id to resolve
 * @returns The resolved theme
 */
export function useThemeById(themeId: ThemeInstanceId | string) {
  const { workspace } = useWorkspace()
  return workspaceThemeService.getTheme(themeId, workspace)
}
