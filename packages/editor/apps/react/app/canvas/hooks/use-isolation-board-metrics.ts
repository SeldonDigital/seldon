"use client"

import { getRenderedScale } from "@seldon/editor/lib/canvas/dom/canvas-elements"
import { getIsolationBoardWidth } from "@seldon/editor/lib/canvas/get-isolation-canvas-layout"
import { ISOLATION_HEIGHT_EXCLUDED_CATALOG_IDS } from "@seldon/editor/lib/isolation/excluded-boards"
import { useLayoutEffect, useRef, useState } from "react"

import { ValueType } from "@seldon/core"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"

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
 *    becomes its own board's width, except for a node with an unset width, which
 *    is read at the size its content takes. Measure the anchored board's own
 *    width too, for when its `board.width` is `fit`.
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
        widthsByBoard: measureBoardWidths({
          container,
          anchorRoot,
          resolveNodeBoardKey,
          workspace,
        }),
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

interface MeasureBoardWidthsInput {
  container: HTMLElement
  anchorRoot: HTMLElement
  resolveNodeBoardKey: (nodeId: string) => string | null
  workspace: Workspace
}

/**
 * One node of the anchored variant, the board its component came from, and whether the
 * node leaves its width unset.
 */
interface NodeOccurrence {
  element: HTMLElement | SVGElement
  boardKey: string
  widthIsUnset: boolean
}

/**
 * Width for every board whose component appears in the anchored variant, taken
 * from how wide that component is laid out there. A component used more than
 * once takes its widest occurrence, so its board fits every use.
 */
function measureBoardWidths({
  container,
  anchorRoot,
  resolveNodeBoardKey,
  workspace,
}: MeasureBoardWidthsInput): Record<string, number> {
  const occurrences = collectOccurrences(anchorRoot, resolveNodeBoardKey, workspace)
  const nodeWidths = measureNodeWidths(occurrences, getRenderedScale(anchorRoot))
  const widths: Record<string, number> = {}

  for (const [boardKey, nodeWidth] of Object.entries(nodeWidths)) {
    const boardRoot = findBoardRoot(container, boardKey)

    if (!boardRoot || boardRoot === anchorRoot) continue

    widths[boardKey] = getIsolationBoardWidth(nodeWidth, getHorizontalFrame(boardRoot))
  }

  return widths
}

/** Every node of the anchored variant that a board draws, in document order. */
function collectOccurrences(
  anchorRoot: HTMLElement,
  resolveNodeBoardKey: (nodeId: string) => string | null,
  workspace: Workspace,
): NodeOccurrence[] {
  const occurrences: NodeOccurrence[] = []

  anchorRoot.querySelectorAll("[data-canvas-node-id]").forEach((element) => {
    if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) return

    const nodeId = element.getAttribute("data-canvas-node-id")

    if (!nodeId) return

    const boardKey = resolveNodeBoardKey(nodeId)

    if (!boardKey) return

    occurrences.push({ element, boardKey, widthIsUnset: hasUnsetWidth(nodeId, workspace) })
  })

  return occurrences
}

/**
 * The widest occurrence of each board's component, keyed by board.
 *
 * A node with an unset width is read at `fit-content` rather than at the box it was
 * given, because that box belongs to the parent. Such a node gets no width rule at all,
 * so a text down a column stretches across it and its board would come out as wide as
 * the column instead of as wide as the text. Reading it capped by the space it had is
 * what keeps a long text measuring as the block it wraps into rather than as one
 * unwrapped line.
 *
 * Boxes are read before any width is written, so a node that fills its parent is still
 * measured against the parent as it stands. The unset ones are pinned in one write and
 * read afterward, so the pass costs two layout flushes however many nodes there are.
 *
 * A node that measures no finite width is left out rather than allowed to stand as its
 * board's width, since a board reading `NaN` drops the width and falls back to its own
 * natural size.
 */
function measureNodeWidths(occurrences: NodeOccurrence[], scale: number): Record<string, number> {
  const measured = occurrences.map((occurrence) => ({
    ...occurrence,
    width: getLayoutWidth(occurrence.element, scale),
  }))
  const unset = measured.filter((occurrence) => occurrence.widthIsUnset)
  const inlineWidths = unset.map((occurrence) => occurrence.element.style.width)

  for (const occurrence of unset) {
    occurrence.element.style.width = "fit-content"
  }

  for (const occurrence of unset) {
    occurrence.width = getLayoutWidth(occurrence.element, scale)
  }

  unset.forEach((occurrence, index) => {
    occurrence.element.style.width = inlineWidths[index]
  })

  const nodeWidths: Record<string, number> = {}

  for (const { boardKey, width } of measured) {
    if (!Number.isFinite(width)) continue

    nodeWidths[boardKey] = Math.max(nodeWidths[boardKey] ?? 0, width)
  }

  return nodeWidths
}

/**
 * How wide a node is laid out, in the canvas's own pixels rather than the zoomed ones.
 *
 * An icon renders as an `svg`, which carries no `offsetWidth`, so it is measured by its
 * rendered rect and divided back down by the zoom the board is drawn at.
 */
function getLayoutWidth(element: HTMLElement | SVGElement, scale: number): number {
  if (element instanceof HTMLElement) return element.offsetWidth

  return element.getBoundingClientRect().width / scale
}

/**
 * Whether a node leaves its own width unset, so the box it gets belongs to whatever it
 * sits in.
 *
 * Every other value decides the box itself: `fit` already renders as `fit-content`, and
 * `fill`, a length, a percentage, a dimension step, or a width computed to fit content
 * all say how wide the node means to be. A node with no width value at all falls back to
 * filling, the same as the factory treats it.
 */
function hasUnsetWidth(nodeId: string, workspace: Workspace): boolean {
  const node = workspace.nodes[nodeId]

  if (!node) return false

  return getNodeProperties(node, workspace).width?.type === ValueType.EMPTY
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
