import { Unit, ValueType } from "@seldon/core"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"

import type { IsolationCanvasGroup, IsolationCanvasItem } from "./get-isolation-canvas-groups"
import type { Board, ComponentLevel, Workspace } from "@seldon/core"

// Isolation canvas geometry, measured in device pixels rather than theme tokens.
// The gallery is a sheet the width of the anchored board, with levels stacked as
// rows and boards sized to the node they hold.
export const ISOLATION_COLUMN_GUTTER_PX = 32
export const ISOLATION_ROW_GAP_PX = 64
export const ISOLATION_CANVAS_PADDING_PX = 32
/** Slack around a node inside its board, so the board reads as a frame. */
export const ISOLATION_BOARD_WIDTH_FACTOR = 1.2
const ROOT_FONT_SIZE_PX = 16

export interface IsolationCanvasRow {
  /** Stable react key. A level contributes at most an anchor row and a rest row. */
  key: string
  level: ComponentLevel
  /** The row holding the anchored board, which keeps the full baseline width. */
  isAnchorRow: boolean
  items: IsolationCanvasItem[]
}

/**
 * Rows the isolation canvas renders. Levels stack in hierarchy order, and the
 * anchored board takes the first row of its own level so it keeps the baseline
 * width while its siblings size to their nodes.
 */
export function getIsolationCanvasLayout(groups: IsolationCanvasGroup[]): IsolationCanvasRow[] {
  const rows: IsolationCanvasRow[] = []

  for (const group of groups) {
    const anchorItems = group.items.filter((item) => item.isIsolatedBoard)
    const restItems = group.items.filter((item) => !item.isIsolatedBoard)

    if (anchorItems.length > 0) {
      rows.push({
        key: `${group.level}:anchor`,
        level: group.level,
        isAnchorRow: true,
        items: anchorItems,
      })
    }

    if (restItems.length > 0) {
      rows.push({
        key: group.level,
        level: group.level,
        isAnchorRow: false,
        items: restItems,
      })
    }
  }

  return rows
}

/**
 * The anchored board's width in pixels from its `board.width` property, or
 * `null` when it is `fit` or a unit the canvas cannot convert. The caller then
 * falls back to the board's measured width.
 */
export function getIsolationBaselineWidth(board: Board, workspace: Workspace): number | null {
  const width = getNodeProperties(board, workspace).board?.width

  if (!width || width.type !== ValueType.EXACT) return null

  const value = width.value

  if (value.unit === Unit.PX) return value.value
  if (value.unit === Unit.REM) return value.value * ROOT_FONT_SIZE_PX

  return null
}

/**
 * Width for a board that holds one node of the anchored variant: the width that
 * node is laid out at, plus slack, plus the board's own frame.
 *
 * @param nodeWidth - Rendered width of the node inside the anchored variant.
 * @param boardFrame - The board's horizontal padding and border, which sit
 * inside its width under the border-box reset.
 */
export function getIsolationBoardWidth(nodeWidth: number, boardFrame: number): number {
  return Math.ceil(nodeWidth * ISOLATION_BOARD_WIDTH_FACTOR + boardFrame)
}
