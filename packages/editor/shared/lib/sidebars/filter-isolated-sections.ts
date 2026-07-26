import { ComponentLevel } from "@seldon/core"
import type { Board, Workspace } from "@seldon/core/workspace/types"
import { ISOLATION_EXCLUDED_CATALOG_IDS } from "../isolation/excluded-boards"
import { getIsolationUsage } from "../isolation/get-isolation-usage"
import type { BoardSection } from "./get-board-sections"

/** Catalog id for a component board, or the map key for an authored board. */
function boardKey(board: Board): string | undefined {
  if ("catalogId" in board && board.catalogId) return board.catalogId
  return (board as { id?: string }).id
}

/**
 * Filters each section's boards to the isolated board plus the components the
 * isolated variant uses transitively, keeping every section header so the
 * sidebar shape stays stable. Scoped to `isolatedVariantRootId`, so boards only
 * a sibling variant uses drop out. Both editors call this on top of
 * `getBoardSections`.
 */
export function filterIsolatedSections(
  sections: BoardSection[],
  isolatedBoard: Board,
  isolatedVariantRootId: string | null,
  workspace: Workspace,
): BoardSection[] {
  const usage = getIsolationUsage(
    isolatedBoard,
    isolatedVariantRootId,
    workspace,
  )
  const isolatedKey = boardKey(isolatedBoard)

  // Frame boards are excluded from isolation, so the Frames section would only
  // ever read "No frames". Drop the section entirely instead.
  return sections
    .filter((section) => section.level !== ComponentLevel.FRAME)
    .map((section) => ({
      ...section,
      boards: section.boards.filter((board) => {
        const key = boardKey(board)
        if (!key) return false
        if (key === isolatedKey) return true
        if (ISOLATION_EXCLUDED_CATALOG_IDS.has(key)) return false
        return usage.has(key)
      }),
    }))
}
