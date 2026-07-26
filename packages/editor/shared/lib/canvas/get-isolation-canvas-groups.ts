import {
  Board,
  ComponentLevel,
  ORDERED_COMPONENT_LEVELS,
  getComponentSchema,
  isComponentId,
} from "@seldon/core"
import {
  isAuthoredBoard,
  isComponentBoard,
} from "@seldon/core/workspace/model/components"
import type { Workspace } from "@seldon/core/workspace/types"
import { ISOLATION_EXCLUDED_CATALOG_IDS } from "../isolation/excluded-boards"
import { getIsolationUsage } from "../isolation/get-isolation-usage"
import {
  getBoardVariantRootIds,
  getComponentKey,
} from "../workspace/workspace-accessors"

export interface IsolationCanvasItem {
  board: Board
  /** Variant root ids to render for this board. */
  variantRootIds: string[]
  /** The anchored board renders its selected variant, not this explicit set. */
  isIsolatedBoard: boolean
}

export interface IsolationCanvasGroup {
  level: ComponentLevel
  items: IsolationCanvasItem[]
}

function getBoardLevel(board: Board): ComponentLevel | null {
  if (isComponentBoard(board) && isComponentId(board.catalogId)) {
    return getComponentSchema(board.catalogId).level
  }
  if (isAuthoredBoard(board)) {
    return board.level as ComponentLevel
  }
  return null
}

/**
 * Boards the isolation canvas renders, grouped by component level in hierarchy
 * order. Each group is a row; levels stack top to bottom. The anchored board
 * plus every dependency board it uses appear, and each dependency board carries
 * only the variant roots the anchored board references.
 */
export function getIsolationCanvasGroups(
  isolatedBoard: Board,
  isolatedVariantRootId: string | null,
  workspace: Workspace,
  boards: Board[],
): IsolationCanvasGroup[] {
  const usage = getIsolationUsage(
    isolatedBoard,
    isolatedVariantRootId,
    workspace,
  )
  const isolatedKey = getComponentKey(isolatedBoard)
  const boardsByKey = new Map(
    boards.map((board) => [getComponentKey(board), board]),
  )

  const items: IsolationCanvasItem[] = [
    {
      board: isolatedBoard,
      variantRootIds: getBoardVariantRootIds(isolatedBoard),
      isIsolatedBoard: true,
    },
  ]

  for (const [key, usedRoots] of usage) {
    if (key === isolatedKey) continue
    if (ISOLATION_EXCLUDED_CATALOG_IDS.has(key)) continue
    const board = boardsByKey.get(key)
    if (!board) continue
    const orderedRoots = getBoardVariantRootIds(board).filter((id) =>
      usedRoots.has(id),
    )
    if (orderedRoots.length === 0) continue
    items.push({ board, variantRootIds: orderedRoots, isIsolatedBoard: false })
  }

  const groups: IsolationCanvasGroup[] = []
  for (const level of ORDERED_COMPONENT_LEVELS) {
    const levelItems = items.filter(
      (item) => getBoardLevel(item.board) === level,
    )
    if (levelItems.length > 0) groups.push({ level, items: levelItems })
  }
  return groups
}
