import { getIsolatedVariantUsage } from "@seldon/core/workspace/helpers/components/get-isolated-variant-usage"
import { boardOrderService } from "@seldon/core/workspace/services"

import type { Board, Workspace } from "@seldon/core/workspace/types"

/**
 * Memoized `getIsolatedVariantUsage`. The objects sidebar calls it from every
 * board row, so a single-entry cache keyed by the workspace reference and the
 * frozen anchor keeps the transitive walk from running once per row. The board
 * list is derived here so callers pass only the workspace. The workspace is
 * immutable, so a new reference invalidates the cache.
 */
let cache: {
  workspace: Workspace
  isolatedBoardKey: string
  isolatedVariantRootId: string | null
  usage: Map<string, Set<string>>
} | null = null

function boardKey(board: Board): string {
  if ("catalogId" in board && board.catalogId) return board.catalogId

  return (board as { id?: string }).id ?? ""
}

export function getIsolationUsage(
  isolatedBoard: Board,
  isolatedVariantRootId: string | null,
  workspace: Workspace,
): Map<string, Set<string>> {
  const isolatedBoardKey = boardKey(isolatedBoard)

  if (
    cache &&
    cache.workspace === workspace &&
    cache.isolatedBoardKey === isolatedBoardKey &&
    cache.isolatedVariantRootId === isolatedVariantRootId
  ) {
    return cache.usage
  }

  const boards = boardOrderService.getBoards(workspace)
  const usage = getIsolatedVariantUsage(isolatedBoard, isolatedVariantRootId, workspace, boards)

  cache = { workspace, isolatedBoardKey, isolatedVariantRootId, usage }

  return usage
}
