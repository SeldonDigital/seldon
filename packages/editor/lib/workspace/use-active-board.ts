import { useMemo } from "react"
import { isComponentEntry } from "@seldon/core/workspace/helpers/components/is-component-entry"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useSelection } from "./use-selection"
import { useWorkspace } from "./use-workspace"

export function useActiveBoard() {
  const { selection, selectedNodeId } = useSelection()
  const { workspace } = useWorkspace()

  return {
    activeBoard: useMemo(() => {
      if (!selection) return null
      if (isComponentEntry(selection)) return selection

      return workspaceService.findBoardForNode(selection, workspace)
    }, [selection, workspace]),
  }
}
