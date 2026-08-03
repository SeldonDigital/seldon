"use client"

import { useSharedStore } from "@app/canvas/hooks/use-shared-store"
import { useRefBindings } from "@app/refs/use-ref-bindings"
import { useActiveBoard } from "@app/workspace/hooks/use-active-board"
import { useSelectedNodeId } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { setAnchoredNodes } from "@seldon/editor/lib/canvas/connectors/anchored-nodes-store"
import { badgeGutterStore } from "@seldon/editor/lib/canvas/connectors/badge-gutter-store"
import {
  getGutterSide,
  layoutConnectors,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import {
  buildConnectorSources,
  buildPlacedConnectors,
  collectAnchoredNodeIds,
  collectReferencedNodeIds,
  collectScopedNodeIds,
  collectSummaryNodes,
} from "@seldon/editor/lib/canvas/connectors/ref-connectors"
import { nodeRectsStore } from "@seldon/editor/lib/canvas/tracking/node-rects-store"
import { useEffect, useMemo, useRef } from "react"

import { useCanvasSize } from "../../../hooks/use-canvas-size"
import { useConnectorMetrics } from "./use-connector-metrics"
import { useFollowCanvasTransform } from "./use-follow-canvas-transform"

import type {
  ConnectorLayoutResult,
  GutterSide,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { PlacedConnector } from "@seldon/editor/lib/canvas/connectors/ref-connectors"
import type { RefObject } from "react"

interface RefConnectorState {
  entries: PlacedConnector[]
  canvasSize: { width: number; height: number }
  omitted: number
  omittedBadge: ConnectorLayoutResult["omittedBadge"]
  /** The dot where a connector meets its node, `0` until the metrics are read. */
  anchorRadius: number
  /** Every badge's label, and the element the metrics are read from. */
  labels: string[]
  measureRef: RefObject<HTMLElement | null>
}

/** Stands in until the badges have been measured, which is what the column places by. */
const NOTHING_PLACED: ConnectorLayoutResult = {
  placements: [],
  omitted: 0,
  omittedBadge: null,
}

/**
 * The connectors to draw for the current selection, already laid out.
 *
 * Scoped to the selection rather than the whole board. A board can carry dozens of
 * refs, and a column of dozens of badges reads as noise, so selecting a component in
 * the objects sidebar is what asks the question "what is wired up in here".
 */
export function useRefConnector(): RefConnectorState {
  const { refBindings } = useRefBindings()
  const selectedNodeId = useSelectedNodeId()
  const { activeBoard } = useActiveBoard()
  const { workspace } = useWorkspace()
  // The rect map is written in place, so its version is what says a node has moved.
  const rectsVersion = useSharedStore(nodeRectsStore, (state) => state.version)
  const canvasSize = useCanvasSize()
  const gutterSide = useRef<GutterSide>("right")
  // The token overlay publishes the edge its column hangs off. When it draws, the
  // reference column starts from the opposite edge, so the two favor opposite sides
  // rather than stacking together.
  const tokenSide = useSharedStore(badgeGutterStore, (state) => state.tokenSide)

  const scopedNodeIds = useMemo(
    () => collectScopedNodeIds(activeBoard, selectedNodeId),
    [activeBoard, selectedNodeId],
  )

  const referencedNodeIds = useMemo(() => collectReferencedNodeIds(refBindings), [refBindings])

  const summaryNodes = useMemo(
    () =>
      collectSummaryNodes(activeBoard, workspace, selectedNodeId, scopedNodeIds, referencedNodeIds),
    [activeBoard, workspace, selectedNodeId, scopedNodeIds, referencedNodeIds],
  )

  useFollowCanvasTransform(scopedNodeIds)

  const sources = useMemo(
    () =>
      buildConnectorSources(
        refBindings,
        nodeRectsStore.getState().rects,
        scopedNodeIds,
        summaryNodes,
      ),
    [refBindings, rectsVersion, scopedNodeIds, summaryNodes],
  )

  const labels = useMemo(() => sources.map((source) => source.label), [sources])
  const { metrics, measureRef } = useConnectorMetrics(labels)

  // The badge's own gap spaces the column as well, both between badges and off the canvas
  // top and bottom, so the spacing follows the badge rather than a number kept here.
  //
  // The edge the column hangs off is carried between frames, because moving it takes a
  // clear win over where it already is. See `getGutterSide`.
  const layout = useMemo(() => {
    if (!metrics) return NOTHING_PLACED

    // Bias off the token column's opposite edge when it is drawn, and off the last
    // edge otherwise. `getGutterSide` still moves to the crowded edge when it must,
    // so this favors the opposite side without pinning it.
    const preferred: GutterSide = tokenSide
      ? tokenSide === "right"
        ? "left"
        : "right"
      : gutterSide.current

    const side = getGutterSide(
      sources,
      { canvasWidth: canvasSize.width, gutter: metrics.gutter },
      preferred,
    )

    gutterSide.current = side

    return layoutConnectors(sources, {
      canvasWidth: canvasSize.width,
      canvasHeight: canvasSize.height,
      badgeWidth: metrics.badgeWidth,
      badgeHeight: metrics.badgeHeight,
      badgeGap: metrics.badgeGap,
      margin: metrics.badgeGap,
      gutter: metrics.gutter,
      side,
    })
  }, [sources, canvasSize.width, canvasSize.height, metrics, tokenSide])

  const entries = useMemo(
    () => buildPlacedConnectors(layout.placements, refBindings),
    [layout.placements, refBindings],
  )

  // Published for the wireframe overlay, which draws a box per node and colors the ones a
  // connector meets. It reads a set of ids and stays clear of anything about refs.
  const anchoredNodeIds = useMemo(() => collectAnchoredNodeIds(entries), [entries])

  useEffect(() => {
    setAnchoredNodes(anchoredNodeIds)
  }, [anchoredNodeIds])

  // Cleared on the way out rather than alongside each write, which happens every frame of
  // a pan and would flicker every colored box back and forth.
  useEffect(() => {
    return () => setAnchoredNodes([])
  }, [])

  return {
    entries,
    canvasSize,
    omitted: layout.omitted,
    omittedBadge: layout.omittedBadge,
    anchorRadius: metrics?.anchorRadius ?? 0,
    labels,
    measureRef,
  }
}
