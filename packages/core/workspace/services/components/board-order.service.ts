import { getComponentSchema } from "../../../components/catalog"
import {
  ComponentId,
  ComponentLevel,
  ORDERED_COMPONENT_LEVELS,
} from "../../../components/constants"
import {
  getBoardOrder,
  setBoardOrder,
} from "../../helpers/components/board-sort-order"
import { isComponentBoard } from "../../model/components"
import { Board, Workspace } from "../../types"
import { mutateWorkspace } from "../shared/workspace-mutation.helper"

/** Orders the boards in `workspace.components` by component level then label. */
export class BoardOrderService {
  /** Sorts boards by component level then label and rewrites their stored order. */
  public realignBoardOrder(workspace: Workspace): Workspace {
    return mutateWorkspace(workspace, (draft) => {
      const boardEntries = Object.entries(draft.components) as [
        ComponentId,
        Board,
      ][]

      boardEntries.sort(([aId, aBoard], [bId, bBoard]) =>
        compareBoardOrder(aId, aBoard, bId, bBoard),
      )

      boardEntries.forEach(([, board], index) => setBoardOrder(board, index))
    })
  }

  /** All boards sorted by their stored order. */
  public getBoards(workspace: Workspace): Board[] {
    return Object.values(workspace.components).sort(
      (a, b) => getBoardOrder(a) - getBoardOrder(b),
    )
  }
}

export const boardOrderService = new BoardOrderService()

/**
 * Orders boards by component level, then component boards alphabetically by label.
 * Boards without a registered component schema keep their stored order.
 */
function compareBoardOrder(
  aId: ComponentId,
  aBoard: Board,
  bId: ComponentId,
  bBoard: Board,
): number {
  try {
    const aLevelIndex = componentLevelIndex(getComponentSchema(aId).level)
    const bLevelIndex = componentLevelIndex(getComponentSchema(bId).level)
    if (aLevelIndex !== bLevelIndex) {
      return aLevelIndex - bLevelIndex
    }
    if (isComponentBoard(aBoard) && isComponentBoard(bBoard)) {
      return aBoard.label.localeCompare(bBoard.label)
    }
  } catch {
    // Fall through to stored order below.
  }
  return getBoardOrder(aBoard) - getBoardOrder(bBoard)
}

/** Position of a component level in the ordered hierarchy; unknown levels sort last. */
function componentLevelIndex(level: ComponentLevel): number {
  const index = ORDERED_COMPONENT_LEVELS.indexOf(level)
  return index === -1 ? ORDERED_COMPONENT_LEVELS.length : index
}
