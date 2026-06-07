import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"

export function useThemes() {
  const { workspace } = useWorkspace()

  return workspaceThemeService.getThemes(workspace)
}
