"use client"

import { useSharedStore } from "@app/canvas/hooks/use-shared-store"
import { useRefBindings } from "@app/refs/use-ref-bindings"
import { useActiveBoard } from "@app/workspace/hooks/use-active-board"
import { useSelectedNodeId } from "@app/workspace/hooks/use-selection"
import {
  CONNECTOR_LAYOUT_DEFAULTS,
  layoutConnectors,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { nodeRectsStore } from "@seldon/editor/lib/canvas/tracking/node-rects-store"
import { collectDescendantNodeIds } from "@seldon/editor/lib/workspace/component-tree"
import { useMemo } from "react"

import { useCanvasSize } from "../../../hooks/use-canvas-size"

import type { Board, EntryNodeId } from "@seldon/core/workspace/types"
import type {
  ConnectorLayoutResult,
  ConnectorPlacement,
  ConnectorSource,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { NodeRect } from "@seldon/editor/lib/canvas/overlay/geometry"
import type { RefBinding } from "@seldon/editor/lib/refs/join-refs-and-bindings"

/** One placed connector and the binding it reports, paired for the chip that draws it. */
export interface PlacedBinding {
  placement: ConnectorPlacement
  binding: RefBinding
}

interface RefConnectorState {
  entries: PlacedBinding[]
  canvasSize: { width: number; height: number }
  omitted: number
  omittedChip: ConnectorLayoutResult["omittedChip"]
}

/**
 * The connectors to draw for the current selection, already laid out.
 *
 * Scoped to the selection rather than the whole board. A board can carry dozens of
 * refs, and a column of dozens of chips reads as noise, so selecting a component in
 * the objects sidebar is what asks the question "what is wired up in here".
 */
export function useRefConnector(): RefConnectorState {
  const { refBindings } = useRefBindings()
  const selectedNodeId = useSelectedNodeId()
  const { activeBoard } = useActiveBoard()
  const rects = useSharedStore(nodeRectsStore, (state) => state.rects)
  const canvasSize = useCanvasSize()

  const scopedNodeIds = useMemo(
    () => collectScopedNodeIds(activeBoard, selectedNodeId),
    [activeBoard, selectedNodeId],
  )

  const sources = useMemo(
    () => buildSources(refBindings, rects, scopedNodeIds),
    [refBindings, rects, scopedNodeIds],
  )

  const layout = useMemo(
    () =>
      layoutConnectors(sources, {
        canvasWidth: canvasSize.width,
        canvasHeight: canvasSize.height,
        ...CONNECTOR_LAYOUT_DEFAULTS,
      }),
    [sources, canvasSize.width, canvasSize.height],
  )

  const entries = useMemo(
    () => buildEntries(layout.placements, refBindings),
    [layout.placements, refBindings],
  )

  return { entries, canvasSize, omitted: layout.omitted, omittedChip: layout.omittedChip }
}

/**
 * The selected node and everything under it.
 *
 * Descendants are included because a component's refs mostly sit on its children,
 * so selecting the component is what shows its wiring. An empty set means nothing
 * is selected, and no connector draws.
 */
function collectScopedNodeIds(board: Board | null, selectedNodeId: string | null): Set<string> {
  if (!board || !selectedNodeId) return new Set()

  const descendants = collectDescendantNodeIds(board, selectedNodeId as EntryNodeId)

  return new Set<string>([selectedNodeId, ...descendants])
}

/**
 * The refs worth drawing, in the order the layout will sort anyway.
 *
 * Only nodes the canvas is tracking get a connector, so a node that is not on screen
 * is not pointed at. A stale binding has no workspace node, so there is nothing to
 * anchor to and it is left to the sidebar to report.
 */
function buildSources(
  bindings: RefBinding[],
  rects: Record<string, NodeRect | null>,
  scopedNodeIds: Set<string>,
): ConnectorSource[] {
  const sources: ConnectorSource[] = []

  for (const binding of bindings) {
    const nodeId = binding.node?.nodeId

    if (!nodeId) continue
    if (!scopedNodeIds.has(nodeId)) continue

    const rect = rects[nodeId]

    if (!rect) continue

    sources.push({
      key: binding.ref,
      label: binding.ref,
      rect,
      muted: binding.state !== "bound",
    })
  }

  return sources
}

/** Pairs each placement back to its binding so a chip can show the detail. */
function buildEntries(placements: ConnectorPlacement[], bindings: RefBinding[]): PlacedBinding[] {
  const byRef = new Map(bindings.map((binding) => [binding.ref, binding]))
  const entries: PlacedBinding[] = []

  for (const placement of placements) {
    const binding = byRef.get(placement.key)

    if (binding) {
      entries.push({ placement, binding })
    }
  }

  return entries
}
