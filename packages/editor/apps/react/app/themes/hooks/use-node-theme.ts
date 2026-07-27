import { useWorkspace } from "@app/workspace/hooks/use-workspace"

import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"

import type { Board, Instance, Variant } from "@seldon/core"

export function useNodeTheme(nodeOrBoard: Variant | Instance | Board) {
  const { workspace } = useWorkspace()

  return workspaceThemeService.getObjectTheme(nodeOrBoard, workspace)
}
