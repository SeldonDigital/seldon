import { themeService } from "@seldon/core/workspace/services/theme.service"
import { useWorkspace } from "@lib/workspace/use-workspace"

export function useThemes() {
  const { workspace } = useWorkspace()

  return themeService.getThemes(workspace)
}
