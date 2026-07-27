import { useWorkspace } from "@app/workspace/hooks/use-workspace"

import { ThemeInstanceId } from "@seldon/core/themes/types"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"

/**
 * Resolves a theme by its id against the active workspace.
 * @param themeId - The theme entry id to resolve
 * @returns The resolved theme
 */
export function useThemeById(themeId: ThemeInstanceId | string) {
  const { workspace } = useWorkspace()
  return workspaceThemeService.getTheme(themeId, workspace)
}
