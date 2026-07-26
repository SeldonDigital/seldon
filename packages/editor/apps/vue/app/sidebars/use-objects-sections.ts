import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { filterIsolatedSections } from "@seldon/editor/lib/sidebars/filter-isolated-sections"
import {
  type BoardSection,
  getBoardSections,
} from "@seldon/editor/lib/sidebars/get-board-sections"
import { storeToRefs } from "pinia"
import { type Ref, computed } from "vue"

import { boardOrderService } from "@seldon/core/workspace/services"
import type { Workspace } from "@seldon/core/workspace/types"

/** Section levels that belong to the Resources view of the objects sidebar. */
const RESOURCE_SECTION_LEVELS: ReadonlySet<BoardSection["level"]> = new Set([
  "THEME",
  "FONT_COLLECTION",
  "ICON_SET",
  "MEDIA",
])

/**
 * Boards grouped into display sections for the objects sidebar, filtered by the
 * active Components/Resources view and the Show Playgrounds toggle. Mirrors the
 * React `useObjectsSidebar` grouping on top of the shared `getBoardSections`.
 */
export function useObjectsSections(
  workspace: Ref<Workspace>,
): Ref<BoardSection[]> {
  const config = useEditorConfigStore()
  const {
    objectsView,
    showPlayground,
    isolatedView,
    isolatedBoardKey,
    isolatedVariantRootId,
  } = storeToRefs(config)

  return computed(() => {
    const boards = boardOrderService.getBoards(workspace.value)
    const playgrounds = boardOrderService.getPlaygrounds(workspace.value)
    const allSections = getBoardSections(boards, playgrounds)
    const viewSections = allSections.filter((section) =>
      objectsView.value === "resources"
        ? RESOURCE_SECTION_LEVELS.has(section.level)
        : !RESOURCE_SECTION_LEVELS.has(section.level),
    )
    const withPlayground = showPlayground.value
      ? viewSections
      : viewSections.filter((section) => section.level !== "PLAYGROUND")

    const isolatedKey = isolatedBoardKey.value
    const isolatedBoard = isolatedKey
      ? workspace.value.boards[isolatedKey]
      : null
    if (isolatedView.value && isolatedBoard) {
      return filterIsolatedSections(
        withPlayground,
        isolatedBoard,
        isolatedVariantRootId.value,
        workspace.value,
      )
    }
    return withPlayground
  })
}
