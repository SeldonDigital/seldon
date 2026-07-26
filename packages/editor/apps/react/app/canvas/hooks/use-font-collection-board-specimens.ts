import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { useMemo } from "react"

import { Board } from "@seldon/core"
import { getEnabledVariants } from "@seldon/core/font-collections"
import { fontVariantDisplayLabel } from "@seldon/core/helpers/utils/font-variant"
import { isFontCollectionBoard } from "@seldon/core/workspace/model/components"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services/font-collection/font-collection.service"

/**
 * Derives the type specimens rendered on a font collection board, one per
 * visible family slot, tagged with its variant entry and enabled weight labels.
 * @param board - The font collection board
 * @returns One specimen entry per visible family slot
 */
export function useFontCollectionBoardSpecimens(board: Board) {
  const { workspace } = useWorkspace()

  return useMemo(() => {
    const entryIds = isFontCollectionBoard(board)
      ? board.variants.map((variant) => variant.id)
      : []
    return entryIds.flatMap((entryId) => {
      const collection = workspaceFontCollectionService.getFontCollection(
        entryId,
        workspace,
      )
      if (!collection) return []
      const selection = workspaceFontCollectionService.getVariantSelection(
        entryId,
        workspace,
      )
      return Object.entries(collection.families).flatMap(([slot, family]) => {
        const variants = family.variants ?? []
        // Families without weight variants (local/system) always show and have
        // no weights line.
        if (variants.length === 0) {
          return [{ entryId, slot, family, weightsLabel: "" }]
        }
        const enabled = getEnabledVariants(selection[slot], variants)
        // A family shows only when at least one weight is enabled.
        if (enabled.length === 0) return []
        const weightsLabel = enabled.map(fontVariantDisplayLabel).join(", ")
        return [{ entryId, slot, family, weightsLabel }]
      })
    })
  }, [board, workspace])
}
