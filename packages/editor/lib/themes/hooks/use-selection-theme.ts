import { invariant } from "@seldon/core"
import { themeService } from "@seldon/core/workspace/services/theme.service"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"

export function useSelectionTheme() {
  const { selection } = useSelection()
  const { workspace } = useWorkspace()

  invariant(selection, "Nothing selected")

  return themeService.getObjectTheme(selection, workspace)
}
