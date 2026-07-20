import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { useMemo } from "react"

import { Board } from "@seldon/core"
import { isIconSetBoard } from "@seldon/core/workspace/model/components"
import { workspaceIconSetService } from "@seldon/core/workspace/services/icon-set/icon-set.service"

/**
 * Derives the flat list of icons rendered on an icon set board, pairing each
 * icon with the variant entry it belongs to.
 * @param board - The icon set board
 * @returns One entry per icon, tagged with its variant entry id
 */
export function useIconSetBoardIcons(board: Board) {
  const { workspace } = useWorkspace()

  return useMemo(() => {
    const entryIds = isIconSetBoard(board)
      ? board.variants.map((variant) => variant.id)
      : []
    return entryIds.flatMap((entryId) =>
      workspaceIconSetService
        .getIncludedIcons(entryId, workspace)
        .map((iconId) => ({ entryId, iconId })),
    )
  }, [board, workspace])
}
