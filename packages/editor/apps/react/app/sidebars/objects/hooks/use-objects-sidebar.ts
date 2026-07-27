import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useActiveBoard } from "@app/workspace/hooks/use-active-board"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { filterIsolatedSections } from "@seldon/editor/lib/sidebars/filter-isolated-sections"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { useEffect, useMemo } from "react"

import { boardOrderService } from "@seldon/core/workspace/services"

import { getBoardSections } from "../../helpers/get-board-sections"

import type { BoardSection } from "../../helpers/get-board-sections"

/** Section levels that belong to the Resources view of the objects sidebar. */
const RESOURCE_SECTION_LEVELS: ReadonlySet<BoardSection["level"]> = new Set([
  "THEME",
  "FONT_COLLECTION",
  "ICON_SET",
  "MEDIA",
])

/**
 * Boards list, section grouping, and default-board selection for the objects
 * sidebar. Keeps workspace service access out of the view component.
 */
export function useObjectsSidebar() {
  const { workspace } = useWorkspace({ usePreview: false })
  const { activeBoard } = useActiveBoard()
  const { showPlayground, objectsView, isolatedView, isolatedBoardKey, isolatedVariantRootId } =
    useEditorConfig()
  const { selectBoard, selectedNodeId, selectedBoardId, selectedResourceEntry } = useSelection()

  const boards = useMemo(() => boardOrderService.getBoards(workspace), [workspace])

  const playgrounds = useMemo(() => boardOrderService.getPlaygrounds(workspace), [workspace])

  const sections = useMemo(() => {
    const allSections = getBoardSections(boards, playgrounds)
    const viewSections = allSections.filter((section) =>
      objectsView === "resources"
        ? RESOURCE_SECTION_LEVELS.has(section.level)
        : !RESOURCE_SECTION_LEVELS.has(section.level),
    )
    const withPlayground = showPlayground
      ? viewSections
      : viewSections.filter((section) => section.level !== "PLAYGROUND")

    // Isolation reads the anchored board from the live workspace, so an inserted
    // component grows the set. It keys off the stored board, not the selection,
    // so deselecting does not exit isolation.
    const isolatedBoard = isolatedBoardKey ? workspace.boards[isolatedBoardKey] : null

    if (isolatedView && isolatedBoard) {
      return filterIsolatedSections(withPlayground, isolatedBoard, isolatedVariantRootId, workspace)
    }

    return withPlayground
  }, [
    boards,
    playgrounds,
    showPlayground,
    objectsView,
    isolatedView,
    isolatedBoardKey,
    isolatedVariantRootId,
    workspace,
  ])

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
  }, [boards, activeBoard, selectBoard, selectedNodeId, selectedBoardId, selectedResourceEntry])

  return { sections }
}
