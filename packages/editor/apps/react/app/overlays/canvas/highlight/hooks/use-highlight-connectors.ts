"use client"

import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import {
  CONNECTOR_TOKENS,
  toElbowPath,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import {
  buildGutterLattice,
  buildGutterRoute,
} from "@seldon/editor/lib/canvas/connectors/gutter-route"
import { getCanvasElement } from "@seldon/editor/lib/canvas/dom/canvas-elements"
import {
  calculateSelectionOutline,
  clampRectToBoard,
} from "@seldon/editor/lib/canvas/overlay/measure"
import { measureIsolationGallery } from "@seldon/editor/lib/canvas/overlay/measure-isolation-gallery"
import {
  getCanvasSelectionElements,
  getScopedSelectionElement,
} from "@seldon/editor/lib/canvas/overlay/selection-target"
import { getTokenPixels } from "@seldon/editor/lib/themes/token-pixels"
import { useEffect, useMemo, useState } from "react"

import { useCanvasRemeasureStore } from "../../../../canvas/hooks/use-canvas-remeasure-store"
import { useCanvasSize } from "../../../hooks/use-canvas-size"
import { useSharedNodeHighlight } from "../../../hooks/use-shared-node-highlight"
import {
  highlightAnchorStyle,
  highlightSecondaryAnchorStyle,
  highlightSecondaryStrokeStyle,
  highlightStrokeStyle,
} from "../highlight-connector-style"

import type { CanvasSize } from "../../../hooks/use-canvas-size"
import type { SharedNodeHighlight } from "../../../hooks/use-shared-node-highlight"
import type { ConnectorShape } from "@app/overlays/primitives/ConnectorPaths.bespoke"
import type { Workspace } from "@seldon/core"
import type { NodeRect } from "@seldon/editor/lib/canvas/overlay/geometry"

interface HighlightConnectorsState {
  shapes: ConnectorShape[]
  canvasSize: CanvasSize
}

/** One node a connector runs to, as measured on the canvas. */
interface HighlightTarget {
  key: string
  element: HTMLElement
  rect: NodeRect
  /** The template the node draws from, which is what makes two copies a repeat. */
  template: string
  isSecondary: boolean
}

interface BuildShapesOptions {
  highlight: SharedNodeHighlight
  workspace: Workspace
  selectedNodeId: string | null
  selectedNodeRootId: string | null
  anchorRadius: number
}

/**
 * The connectors to draw from the selected node across its branch.
 *
 * A node drawn in several places is pointed at in each of them, so a variant used
 * in three boards fans out three ways. Copies of one template repeated inside a
 * single parent are one group though, and the first of them stands for the rest.
 * Twenty lines into twenty identical rows say nothing the first line does not.
 *
 * Rects are read from the DOM rather than the shared tracker, which only follows
 * the active board. The isolation gallery draws many boards at once and a
 * connector spans them, so both ends are measured here.
 */
export function useHighlightConnectors(): HighlightConnectorsState {
  const highlight = useSharedNodeHighlight()
  const { workspace } = useWorkspace()
  const { selectedNodeId, selectedNodeRootId } = useSelection()
  const canvasSize = useCanvasSize()
  const anchorRadius = useAnchorRadius()
  const frame = useTransformFrame()
  const version = useCanvasRemeasureStore((state) => state.version)

  // Re-measured whenever the canvas moves or settles, since the lines are drawn
  // outside the pan and zoom transform and would otherwise come unstuck.
  const shapes = useMemo(
    () => buildShapes({ highlight, workspace, selectedNodeId, selectedNodeRootId, anchorRadius }),
    [
      highlight,
      workspace,
      selectedNodeId,
      selectedNodeRootId,
      anchorRadius,
      canvasSize,
      frame,
      version,
    ],
  )

  return { shapes, canvasSize }
}

function buildShapes({
  highlight,
  workspace,
  selectedNodeId,
  selectedNodeRootId,
  anchorRadius,
}: BuildShapesOptions): ConnectorShape[] {
  if (!selectedNodeId) return []

  const obstacles = measureIsolationGallery()

  if (!obstacles) return []

  const sourceElement = getScopedSelectionElement(selectedNodeId, selectedNodeRootId)

  if (!sourceElement) return []

  const source = measureVisible(sourceElement)
  const lattice = buildGutterLattice(obstacles)
  const targets = collectTargets({ highlight, workspace, selectedNodeId, sourceElement })

  return targets.map((target) => {
    const route = buildGutterRoute(source, target.rect, lattice)

    return {
      key: target.key,
      d: toElbowPath(route.points),
      // The dot marks where the line lands, which is the copy being pointed out.
      // The selected end already carries the selection outline.
      anchorX: route.endAnchor.x,
      anchorY: route.endAnchor.y,
      anchorRadius,
      strokeStyle: target.isSecondary ? highlightSecondaryStrokeStyle : highlightStrokeStyle,
      anchorStyle: target.isSecondary ? highlightSecondaryAnchorStyle : highlightAnchorStyle,
    }
  })
}

interface CollectTargetsOptions {
  highlight: SharedNodeHighlight
  workspace: Workspace
  selectedNodeId: string
  sourceElement: HTMLElement
}

/**
 * Every highlighted node worth pointing at, in the order they are drawn.
 *
 * The selection itself is the source rather than a target, and a repeat keeps only
 * its first copy.
 */
function collectTargets({
  highlight,
  workspace,
  selectedNodeId,
  sourceElement,
}: CollectTargetsOptions): HighlightTarget[] {
  const found: HighlightTarget[] = []

  const collect = (nodeId: string, isSecondary: boolean) => {
    if (nodeId === selectedNodeId) return

    const template = workspace.nodes[nodeId]?.template ?? nodeId

    getCanvasSelectionElements(nodeId).forEach((element, index) => {
      if (element === sourceElement) return

      found.push({
        key: `${nodeId}:${index}`,
        element,
        rect: measureVisible(element),
        template,
        isSecondary,
      })
    })
  }

  for (const nodeId of highlight.primary) collect(nodeId, false)
  for (const nodeId of highlight.secondary) collect(nodeId, true)

  // Each set is ordered on its own and the primary one goes first, so a group
  // holding both keeps the line that carries the stronger relationship.
  const primary = found.filter((target) => !target.isSecondary).sort(compareDocumentOrder)
  const secondary = found.filter((target) => target.isSecondary).sort(compareDocumentOrder)

  return dropRepeats([...primary, ...secondary])
}

/**
 * Keeps the first copy of each template under a parent and drops the rest.
 *
 * Repeated rows are separate nodes that all draw from one template, so a lineage
 * that reaches one of them reaches every one. Copies under different parents are
 * different groups and each keep a line, which is what shows the reach.
 */
function dropRepeats(targets: HighlightTarget[]): HighlightTarget[] {
  const seen = new Map<Element, Set<string>>()

  return targets.filter((target) => {
    const parent = getGroupParent(target.element)

    if (!parent) return true

    const templates = seen.get(parent)

    if (!templates) {
      seen.set(parent, new Set([target.template]))

      return true
    }

    if (templates.has(target.template)) return false

    templates.add(target.template)

    return true
  })
}

/** The node a copy is repeated inside, or the board when it is a board's own root. */
function getGroupParent(element: HTMLElement): Element | null {
  return (
    element.parentElement?.closest("[data-canvas-node-id]") ?? element.closest("[data-board-id]")
  )
}

/**
 * Where a node shows inside its board. A node scrolled out of view flattens
 * against the edge it went past, so its connector points into where it went
 * rather than disappearing.
 */
function measureVisible(element: HTMLElement): NodeRect {
  return clampRectToBoard(element, calculateSelectionOutline({ nodeEl: element }))
}

function compareDocumentOrder(a: HighlightTarget, b: HighlightTarget): number {
  const position = a.element.compareDocumentPosition(b.element)

  return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
}

/**
 * The radius of the dot at a connector's end, read from the theme the canvas is
 * pinned to. It shares the ref connectors' token so both marks stay the same size.
 */
function useAnchorRadius(): number {
  const [radius, setRadius] = useState(0)

  useEffect(() => {
    const canvas = getCanvasElement()

    if (!canvas) return

    setRadius(getTokenPixels(CONNECTOR_TOKENS, canvas).anchorRadius)
  }, [])

  return radius
}

/** Counts frames while the canvas pans or zooms, so the lines follow it. */
function useTransformFrame(): number {
  const isTransforming = useCanvasRemeasureStore((state) => state.isTransforming)
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (!isTransforming) return

    let handle = 0

    const step = () => {
      setFrame((current) => current + 1)
      handle = requestAnimationFrame(step)
    }

    handle = requestAnimationFrame(step)

    return () => cancelAnimationFrame(handle)
  }, [isTransforming])

  return frame
}
