import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"

import { invariant } from "@seldon/core"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"

export function useSelectionTheme() {
  const { selection } = useSelection()
  const { workspace } = useWorkspace()

  invariant(selection, "Nothing selected")

  return workspaceThemeService.getObjectTheme(selection, workspace)
}
