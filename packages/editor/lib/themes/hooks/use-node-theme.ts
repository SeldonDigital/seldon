import { Board, Instance, Variant } from "@seldon/core"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"

export function useNodeTheme(nodeOrBoard: Variant | Instance | Board) {
  const { workspace } = useWorkspace()
  return workspaceThemeService.getObjectTheme(nodeOrBoard, workspace)
}
