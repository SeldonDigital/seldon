import { useEffect, useMemo } from "react"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useActiveBoard } from "@lib/workspace/hooks/use-active-board"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { getBoardSections } from "../../helpers/get-board-sections"

/**
 * Boards list, section grouping, and default-board selection for the objects
 * sidebar. Keeps workspace service access out of the view component.
 */
export function useObjectsSidebar() {
  const { workspace } = useWorkspace({ usePreview: false })
  const { activeBoard } = useActiveBoard()
  const { showPlayground } = useEditorConfig()
  const {
    selectBoard,
    selectedNodeId,
    selectedBoardId,
    selectedResourceEntry,
  } = useSelection()

  const boards = useMemo(
    () => workspaceService.getBoards(workspace),
    [workspace],
  )

  const playgrounds = useMemo(
    () => workspaceService.getPlaygrounds(workspace),
    [workspace],
  )

  const sections = useMemo(() => {
    const allSections = getBoardSections(boards, playgrounds)
    if (showPlayground) return allSections
    return allSections.filter((section) => section.level !== "PLAYGROUND")
  }, [boards, playgrounds, showPlayground])

  useEffect(() => {
    if (
      !activeBoard &&
      !selectedNodeId &&
      !selectedBoardId &&
      !selectedResourceEntry &&
      boards.length > 0
    ) {
      selectBoard(getComponentKey(boards[0]))
    }
  }, [
    boards,
    activeBoard,
    selectBoard,
    selectedNodeId,
    selectedBoardId,
    selectedResourceEntry,
  ])

  return { sections }
}
