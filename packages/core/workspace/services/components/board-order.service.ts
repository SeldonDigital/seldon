import { findComponentSchema } from "../../../components/catalog"
import { ORDERED_COMPONENT_LEVELS } from "../../../components/constants"
import { boardKey } from "../../helpers/components/board-ref-resolver"
import { getBoardOrder, setBoardOrder } from "../../helpers/components/board-sort-order"
import { getBoardUsageCounts } from "../../helpers/components/get-board-usage-counts"
import { isComponentBoard } from "../../model/components"
import { mutateWorkspace } from "../shared/workspace-mutation.helper"

import type { ComponentId, ComponentLevel } from "../../../components/constants"
import type { Board, Workspace } from "../../types"

/**
 * Orders the boards in `workspace.boards` by component level, then within a level
 * by how many other same-level boards each one composes (most first), then label.
 */
export class BoardOrderService {
  /** Sorts boards by level, then out-degree, then label, and stores the order. */
  public realignBoardOrder(workspace: Workspace): Workspace {
    return mutateWorkspace(workspace, (draft) => {
      const usageCounts = getBoardUsageCounts(draft, Object.values(draft.boards))

      const boardEntries = Object.entries(draft.boards) as [ComponentId, Board][]

      boardEntries.sort(([aId, aBoard], [bId, bBoard]) =>
        compareBoardOrder(aId, aBoard, bId, bBoard, usageCounts),
      )

      // Only rewrite a board whose index actually changed, so realigning an
      // already-sorted workspace makes no draft mutation and Immer returns the
      // same reference. The on-load repair relies on this to stay idempotent.
      boardEntries.forEach(([, board], index) => {
        if (getBoardOrder(board) !== index) setBoardOrder(board, index)
      })
    })
  }

  /** All boards sorted by their stored order. */
  public getBoards(workspace: Workspace): Board[] {
    return Object.values(workspace.boards).sort((a, b) => getBoardOrder(a) - getBoardOrder(b))
  }

  /** All playground containers sorted by their stored order. */
  public getPlaygrounds(workspace: Workspace): Board[] {
    return Object.values(workspace.playgrounds ?? {}).sort(
      (a, b) => getBoardOrder(a) - getBoardOrder(b),
    )
  }
}

export const boardOrderService = new BoardOrderService()

/**
 * Orders boards by component level, then within a level by out-degree descending
 * (a board that composes more same-level boards sorts first), then alphabetically
 * by label. Boards without a registered component schema keep their stored order.
 */
function compareBoardOrder(
  aId: ComponentId,
  aBoard: Board,
  bId: ComponentId,
  bBoard: Board,
  usageCounts: Map<string, number>,
): number {
  const aSchema = findComponentSchema(aId)
  const bSchema = findComponentSchema(bId)

  if (aSchema && bSchema) {
    const aLevelIndex = componentLevelIndex(aSchema.level)
    const bLevelIndex = componentLevelIndex(bSchema.level)

    if (aLevelIndex !== bLevelIndex) {
      return aLevelIndex - bLevelIndex
    }

    if (isComponentBoard(aBoard) && isComponentBoard(bBoard)) {
      const aUses = usageCounts.get(boardKey(aBoard) ?? aId) ?? 0
      const bUses = usageCounts.get(boardKey(bBoard) ?? bId) ?? 0

      if (aUses !== bUses) {
        return bUses - aUses
      }

      return aBoard.label.localeCompare(bBoard.label)
    }
  }

  return getBoardOrder(aBoard) - getBoardOrder(bBoard)
}

/** Position of a component level in the ordered hierarchy; unknown levels sort last. */
function componentLevelIndex(level: ComponentLevel): number {
  const index = ORDERED_COMPONENT_LEVELS.indexOf(level)

  return index === -1 ? ORDERED_COMPONENT_LEVELS.length : index
}
