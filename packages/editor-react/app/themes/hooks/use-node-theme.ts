import { useWorkspace } from "@app/workspace/hooks/use-workspace"

import { Board, Instance, Variant } from "@seldon/core"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"

export function useNodeTheme(nodeOrBoard: Variant | Instance | Board) {
  const { workspace } = useWorkspace()
  return workspaceThemeService.getObjectTheme(nodeOrBoard, workspace)
}
