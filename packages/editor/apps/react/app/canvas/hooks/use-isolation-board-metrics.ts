"use client"

import { getIsolationBoardWidth } from "@seldon/editor/lib/canvas/get-isolation-canvas-layout"
import { ISOLATION_HEIGHT_EXCLUDED_CATALOG_IDS } from "@seldon/editor/lib/isolation/excluded-boards"
import { useLayoutEffect, useRef, useState } from "react"

import type { Workspace } from "@seldon/core"
import type { RefObject } from "react"

export interface IsolationBoardMetrics {
  /** Rendered width of the anchored board, or `0` before it is measured. */
  anchorWidth: number
  /** Width per board, keyed by board key, or `null` before measuring. */
  widthsByBoard: Record<string, number> | null
  /** Tallest board per level, keyed by level, or `null` before measuring. */
  heightsByLevel: Record<string, number> | null
}

interface UseIsolationBoardMetricsParams {
  containerRef: RefObject<HTMLElement | null>
  anchorBoardKey: string | null
  /** Maps a rendered node id to the board it instances. */
  resolveNodeBoardKey: (nodeId: string) => string | null
  /** Changes whenever the gallery shows a different set of boards. */
  contentKey: string
  workspace: Workspace
}

const UNMEASURED: IsolationBoardMetrics = {
  anchorWidth: 0,
  widthsByBoard: null,
  heightsByLevel: null,
}

/**
 * Measures the isolation gallery so each board can size to the node it holds and
 * every board in a level can share the tallest height in that level.
 *
 * Boards size themselves from their own `board` property, so both numbers are
 * only known once the gallery renders. The pass runs before paint, in stages,
 * and each stage renders from what the previous one measured:
 *
 * 1. Reset, so boards drop applied sizes and lay out at their natural size.
 * 2. Measure inside the anchored board: the width each node is laid out at
 *    becomes its own board's width. Measure the anchored board's own width too,
 *    for when its `board.width` is `fit`.
 * 3. Measure each level's tallest board, with widths already applied so the
 *    heights account for how content wraps at those widths.
 *
 * The anchored board always renders at its own width, so stage 2 reads the same
 * layout the board shows outside isolation.
 *
 * The Image primitive is skipped in stage 3. It ships a large default that would
 * otherwise set the height for every primitive board.
 *
 * Measuring restarts whenever the anchored board, its variant, or the workspace
 * changes, so an edit that changes board content re-fits the gallery.
 */
export function useIsolationBoardMetrics({
  containerRef,
  anchorBoardKey,
  resolveNodeBoardKey,
  contentKey,
  workspace,
}: UseIsolationBoardMetricsParams): IsolationBoardMetrics {
  const [metrics, setMetrics] = useState<IsolationBoardMetrics>(UNMEASURED)
  const measuredRef = useRef<{ contentKey: string; workspace: Workspace } | null>(null)

  useLayoutEffect(() => {
    const previous = measuredRef.current
    const isStale =
      !previous || previous.contentKey !== contentKey || previous.workspace !== workspace

    measuredRef.current = { contentKey, workspace }

    // Stage 1: drop what the last pass applied so the next one reads the boards
    // at their natural size.
    if (isStale && metrics !== UNMEASURED) {
      setMetrics(UNMEASURED)

      return
    }

    const container = containerRef.current

    if (!container) return

    const anchorRoot = findBoardRoot(container, anchorBoardKey)

    if (!anchorRoot) return

    // Stage 2: read the anchored board, which always renders at its own width.
    if (!metrics.widthsByBoard) {
      setMetrics({
        anchorWidth: anchorRoot.offsetWidth,
        widthsByBoard: measureBoardWidths(container, anchorRoot, resolveNodeBoardKey),
        heightsByLevel: null,
      })

      return
    }

    if (metrics.heightsByLevel) return

    // Stage 3: widths are applied, so each level's tallest board is final.
    setMetrics({
      anchorWidth: metrics.anchorWidth,
      widthsByBoard: metrics.widthsByBoard,
      heightsByLevel: measureLevelHeights(container),
    })
  }, [contentKey, workspace, metrics, anchorBoardKey, resolveNodeBoardKey, containerRef])

  return metrics
}

function findBoardRoot(container: HTMLElement, boardKey: string | null): HTMLElement | null {
  if (!boardKey) return null

  return container.querySelector<HTMLElement>(`[data-board-id="${CSS.escape(boardKey)}"]`)
}

/**
 * Width for every board whose component appears in the anchored variant, taken
 * from how wide that component is laid out there. A component used more than
 * once takes its widest occurrence, so its board fits every use.
 */
function measureBoardWidths(
  container: HTMLElement,
  anchorRoot: HTMLElement,
  resolveNodeBoardKey: (nodeId: string) => string | null,
): Record<string, number> {
  const nodeWidths: Record<string, number> = {}

  anchorRoot.querySelectorAll<HTMLElement>("[data-canvas-node-id]").forEach((element) => {
    const nodeId = element.getAttribute("data-canvas-node-id")

    if (!nodeId) return

    const boardKey = resolveNodeBoardKey(nodeId)

    if (!boardKey) return

    nodeWidths[boardKey] = Math.max(nodeWidths[boardKey] ?? 0, element.offsetWidth)
  })

  const widths: Record<string, number> = {}

  for (const [boardKey, nodeWidth] of Object.entries(nodeWidths)) {
    const boardRoot = findBoardRoot(container, boardKey)

    if (!boardRoot || boardRoot === anchorRoot) continue

    widths[boardKey] = getIsolationBoardWidth(nodeWidth, getHorizontalFrame(boardRoot))
  }

  return widths
}

/** A board's horizontal padding and border, which sit inside its own width. */
function getHorizontalFrame(element: HTMLElement): number {
  const style = getComputedStyle(element)

  return (
    parseFloat(style.paddingLeft) +
    parseFloat(style.paddingRight) +
    parseFloat(style.borderLeftWidth) +
    parseFloat(style.borderRightWidth)
  )
}

function measureLevelHeights(container: HTMLElement): Record<string, number> {
  const heights: Record<string, number> = {}
  const rows = container.querySelectorAll<HTMLElement>("[data-isolation-level]")

  rows.forEach((row) => {
    const level = row.getAttribute("data-isolation-level")

    if (!level) return

    row.querySelectorAll<HTMLElement>("[data-board-id]").forEach((board) => {
      const boardId = board.getAttribute("data-board-id")

      if (!boardId || ISOLATION_HEIGHT_EXCLUDED_CATALOG_IDS.has(boardId)) return

      heights[level] = Math.max(heights[level] ?? 0, board.offsetHeight)
    })
  })

  return heights
}
