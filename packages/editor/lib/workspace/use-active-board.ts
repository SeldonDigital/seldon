import { useMemo } from "react"
import { isBoard } from "@seldon/core/workspace/helpers/is-board"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useSelection } from "./use-selection"
import { useWorkspace } from "./use-workspace"

export function useActiveBoard() {
  const { selection } = useSelection()
  const { workspace } = useWorkspace()

  return {
    activeBoard: useMemo(() => {
      if (!selection) return null
      if (isBoard(selection)) return selection

      return workspaceService.findBoardForNode(selection, workspace)
    }, [selection, workspace]),
  }
}
