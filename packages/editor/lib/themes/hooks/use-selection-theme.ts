import { invariant } from "@seldon/core"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"

export function useSelectionTheme() {
  const { selection } = useSelection()
  const { workspace } = useWorkspace()

  invariant(selection, "Nothing selected")

  return workspaceThemeService.getObjectTheme(selection, workspace)
}
