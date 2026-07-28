import { useSharedStore } from "@app/canvas/hooks/use-shared-store"
import { ConnectorPaths } from "@app/overlays"
import { useRefBindings } from "@app/refs/use-ref-bindings"
import { useActiveBoard } from "@app/workspace/hooks/use-active-board"
import { useSelectedNodeId } from "@app/workspace/hooks/use-selection"
import {
  CONNECTION_LAYOUT_DEFAULTS,
  layoutConnections,
  toElbowPath,
} from "@seldon/editor/lib/canvas/connections/connection-layout"
import { nodeRectsStore } from "@seldon/editor/lib/canvas/tracking/node-rects-store"
import { collectDescendantNodeIds } from "@seldon/editor/lib/workspace/component-tree"
import { useMemo } from "react"

import { useCanvasSize } from "../../hooks/use-canvas-size"
import { ConnectionChip } from "./ConnectionChip"
import { OmittedChip } from "./OmittedChip"
import { connectionStrokeStyle, connectionSvgStyle } from "./connection-style"

import type { ConnectorShape } from "@app/overlays/ConnectorPaths.bespoke"
import type { Board, EntryNodeId } from "@seldon/core/workspace/types"
import type {
  ConnectionPlacement,
  ConnectionSource,
} from "@seldon/editor/lib/canvas/connections/connection-layout"
import type { NodeRect } from "@seldon/editor/lib/canvas/overlay/geometry"
import type { RefBinding } from "@seldon/editor/lib/refs/join-ref-bindings"

interface ConnectionEntry {
  placement: ConnectionPlacement
  binding: RefBinding
}

/**
 * Draws the refs inside the selected component out to named chips.
 *
 * Scoped to the selection rather than the whole board. A board can carry dozens of
 * refs, and a column of dozens of chips reads as noise, so selecting a component in
 * the objects sidebar is what asks the question "what is wired up in here".
 *
 * Only nodes the canvas is tracking get a connector, so a node that is not on
 * screen is not pointed at.
 *
 * A ref with no consumers still draws, faint and dashed. That a ref reached
 * generated code but nothing drives it is the useful thing to see.
 */
export function ConnectionsOverlay() {
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
      layoutConnections(sources, {
        canvasWidth: canvasSize.width,
        canvasHeight: canvasSize.height,
        ...CONNECTION_LAYOUT_DEFAULTS,
      }),
    [sources, canvasSize.width, canvasSize.height],
  )

  const entries = useMemo(
    () => buildEntries(layout.placements, refBindings),
    [layout.placements, refBindings],
  )

  const shapes = useMemo(() => layout.placements.map(toShape), [layout.placements])

  const chipElements = useMemo(
    () =>
      entries.map((entry) => (
        <ConnectionChip
          key={entry.placement.key}
          placement={entry.placement}
          binding={entry.binding}
        />
      )),
    [entries],
  )

  const omittedChip = useMemo(() => {
    if (!layout.omittedChip) return null

    return <OmittedChip chip={layout.omittedChip} count={layout.omitted} />
  }, [layout.omitted, layout.omittedChip])

  if (entries.length === 0) return null

  const { width, height } = canvasSize

  return (
    <>
      <ConnectorPaths shapes={shapes} width={width} height={height} style={connectionSvgStyle} />
      {chipElements}
      {omittedChip}
    </>
  )
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
 * A stale binding has no workspace node, so there is nothing on the canvas to
 * anchor to and it is left to the sidebar to report.
 */
function buildSources(
  bindings: RefBinding[],
  rects: Record<string, NodeRect | null>,
  scopedNodeIds: Set<string>,
): ConnectionSource[] {
  const sources: ConnectionSource[] = []

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
function buildEntries(
  placements: ConnectionPlacement[],
  bindings: RefBinding[],
): ConnectionEntry[] {
  const byRef = new Map(bindings.map((binding) => [binding.ref, binding]))
  const entries: ConnectionEntry[] = []

  for (const placement of placements) {
    const binding = byRef.get(placement.key)

    if (binding) {
      entries.push({ placement, binding })
    }
  }

  return entries
}

function toShape(placement: ConnectionPlacement): ConnectorShape {
  const stroke = connectionStrokeStyle(placement.muted)

  return {
    key: placement.key,
    d: toElbowPath(placement.points),
    stroke: stroke.stroke,
    strokeWidth: stroke.strokeWidth,
    strokeOpacity: stroke.strokeOpacity,
    anchorX: placement.anchor.x,
    anchorY: placement.anchor.y,
    strokeDasharray: stroke.strokeDasharray,
  }
}
