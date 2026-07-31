"use client"

import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { Frame } from "@seldon/components/frames/Frame"
import { getIsolationCanvasGroups } from "@seldon/editor/lib/canvas/get-isolation-canvas-groups"
import {
  ISOLATION_CANVAS_PADDING_PX,
  ISOLATION_COLUMN_GUTTER_PX,
  ISOLATION_ROW_GAP_PX,
  getIsolationBaselineWidth,
  getIsolationCanvasLayout,
} from "@seldon/editor/lib/canvas/get-isolation-canvas-layout"
import { createNodeBoardKeyResolver } from "@seldon/editor/lib/canvas/resolve-node-board-key"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { useMemo, useRef } from "react"

import { boardOrderService } from "@seldon/core/workspace/services"

import { useIsolationBoardMetrics } from "../hooks/use-isolation-board-metrics"
import { ComponentBoard } from "./ComponentBoard"

import type { IsolationBoardSize } from "./ComponentBoard"
import type { Board, ComponentLevel } from "@seldon/core"
import type { IsolationCanvasGroup } from "@seldon/editor/lib/canvas/get-isolation-canvas-groups"
import type { CSSProperties } from "react"

interface IsolationBoardView {
  key: string
  board: Board
  label: string
  variantRootIds: string[]
  boardSize: IsolationBoardSize | undefined
}

interface IsolationRowView {
  key: string
  level: ComponentLevel
  boards: IsolationBoardView[]
}

// Boards keep their measured widths, so the row tracks size to each board and
// never wrap or shrink.
const rowStyle: CSSProperties = {
  display: "grid",
  gridAutoFlow: "column",
  gridAutoColumns: "max-content",
  alignItems: "start",
  columnGap: ISOLATION_COLUMN_GUTTER_PX,
}

/**
 * Isolation gallery: the anchored board plus every dependency board it uses,
 * laid out as a sheet the width of the anchored board. Levels stack as rows in
 * hierarchy order, with the anchored board alone on the first row at its own
 * width. Every other board takes the width of the node it holds inside the
 * anchored variant, and boards in a level share the tallest height in that
 * level, both measured on the canvas. Each dependency board renders only the
 * variant roots the anchored board references; the anchored board renders its
 * selected variant.
 */
export function IsolationBoards() {
  const { workspace } = useWorkspace()
  const { isolatedBoardKey, isolatedVariantRootId } = useEditorConfig()
  const containerRef = useRef<HTMLDivElement>(null)

  const boards = useMemo(() => boardOrderService.getBoards(workspace), [workspace])
  const isolatedBoard = isolatedBoardKey ? workspace.boards[isolatedBoardKey] : null

  const groups = useMemo(() => {
    if (!isolatedBoard) return []

    return getIsolationCanvasGroups(isolatedBoard, isolatedVariantRootId, workspace, boards)
  }, [isolatedBoard, isolatedVariantRootId, workspace, boards])

  // The anchored board's own width is the baseline. A `fit` width has no number
  // to read, so the gallery measures what it renders at instead.
  const propertyWidth = useMemo(() => {
    if (!isolatedBoard) return null

    return getIsolationBaselineWidth(isolatedBoard, workspace)
  }, [isolatedBoard, workspace])

  const resolveNodeBoardKey = useMemo(
    () => createNodeBoardKeyResolver(workspace, boards),
    [workspace, boards],
  )
  const contentKey = useMemo(() => getContentKey(groups, propertyWidth), [groups, propertyWidth])

  const metrics = useIsolationBoardMetrics({
    containerRef,
    anchorBoardKey: isolatedBoardKey,
    resolveNodeBoardKey,
    contentKey,
    workspace,
  })

  const baselineWidth = propertyWidth ?? metrics.anchorWidth

  const rows = useMemo<IsolationRowView[]>(() => {
    const layout = getIsolationCanvasLayout(groups)

    return layout.map((row) => ({
      key: row.key,
      level: row.level,
      boards: row.items.map((item) => {
        const key = getComponentKey(item.board)
        const width = row.isAnchorRow ? baselineWidth : metrics.widthsByBoard?.[key]

        return {
          key,
          board: item.board,
          label: item.label,
          // The anchored board renders only the variant frozen on enable, so
          // selecting other components never brings its other variants back.
          variantRootIds: item.isIsolatedBoard
            ? isolatedVariantRootId
              ? [isolatedVariantRootId]
              : item.variantRootIds
            : item.variantRootIds,
          boardSize: getBoardSize(width, metrics.heightsByLevel?.[row.level]),
        }
      }),
    }))
  }, [groups, baselineWidth, metrics.widthsByBoard, metrics.heightsByLevel, isolatedVariantRootId])

  const columnStyle = useMemo<CSSProperties>(() => getColumnStyle(baselineWidth), [baselineWidth])

  if (!isolatedBoard) return null

  return (
    <Frame ref={containerRef} style={columnStyle} data-isolation-gallery>
      {rows.map((row) => (
        <Frame key={row.key} style={rowStyle} data-isolation-level={row.level}>
          {row.boards.map((item) => (
            <ComponentBoard
              key={item.key}
              board={item.board}
              variantRootIds={item.variantRootIds}
              boardLabel={item.label}
              boardSize={item.boardSize}
              useOwnKey
            />
          ))}
        </Frame>
      ))}
    </Frame>
  )
}

function getColumnStyle(baselineWidth: number): CSSProperties {
  const style: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: ISOLATION_ROW_GAP_PX,
    padding: ISOLATION_CANVAS_PADDING_PX,
  }

  // Padding sits inside the width under the global border-box reset, so add it
  // back to keep the sheet's content box exactly one baseline wide.
  if (baselineWidth > 0) {
    style.width = baselineWidth + ISOLATION_CANVAS_PADDING_PX * 2
  }

  return style
}

function getBoardSize(
  width: number | undefined,
  height: number | undefined,
): IsolationBoardSize | undefined {
  if (!width && !height) return undefined

  return { width, height }
}

/**
 * Identity of what the gallery shows. Measuring restarts when this changes, so
 * a different anchored board, dependency set, or baseline re-fits the gallery.
 */
function getContentKey(groups: IsolationCanvasGroup[], propertyWidth: number | null): string {
  const levels = groups.map((group) => {
    const items = group.items.map(
      (item) => `${getComponentKey(item.board)}/${item.variantRootIds.join(",")}`,
    )

    return `${group.level}:${items.join("|")}`
  })

  return `${propertyWidth ?? "fit"}#${levels.join(";")}`
}
