"use client"

import { useSharedStore } from "@app/canvas/hooks/use-shared-store"
import { useRefBindings } from "@app/refs/use-ref-bindings"
import { useActiveBoard } from "@app/workspace/hooks/use-active-board"
import { useSelectedNodeId } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import {
  CONNECTOR_LAYOUT_DEFAULTS,
  layoutConnectors,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { nodeRectsStore } from "@seldon/editor/lib/canvas/tracking/node-rects-store"
import {
  collectDescendantNodeIds,
  getParentNodeIds,
  walkComponentTree,
} from "@seldon/editor/lib/workspace/component-tree"
import { useMemo } from "react"

import { ComponentLevel } from "@seldon/core/components/constants"
import { getEffectiveNodeLevel } from "@seldon/core/workspace/helpers/nodes/get-effective-node-level"

import { useCanvasSize } from "../../../hooks/use-canvas-size"
import { useFollowCanvasTransform } from "./use-follow-canvas-transform"

import type { Board, EntryNodeId, Workspace } from "@seldon/core/workspace/types"
import type {
  ConnectorLayoutResult,
  ConnectorPlacement,
  ConnectorSource,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { NodeRect } from "@seldon/editor/lib/canvas/overlay/geometry"
import type { RefBinding } from "@seldon/editor/lib/refs/join-refs-and-bindings"

/**
 * One placed connector and what its chip reports.
 *
 * A `ref` entry names one ref and opens its card. A `frame` entry stands for the refs
 * inside a frame, which are not drawn one by one, and selects that frame instead.
 */
export type PlacedConnector =
  | { kind: "ref"; placement: ConnectorPlacement; binding: RefBinding }
  | { kind: "frame"; placement: ConnectorPlacement; nodeId: string }

interface RefConnectorState {
  entries: PlacedConnector[]
  canvasSize: { width: number; height: number }
  omitted: number
  omittedChip: ConnectorLayoutResult["omittedChip"]
}

/** Marks a source as standing for a frame's contents rather than for one ref. */
const FRAME_KEY_PREFIX = "frame:"

/** Chips for one node read in this order, the frame's own ref before its summary. */
const REF_ORDER = 0
const SUMMARY_ORDER = 1

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
  const { workspace } = useWorkspace()
  const rects = useSharedStore(nodeRectsStore, (state) => state.rects)
  const canvasSize = useCanvasSize()

  const scopedNodeIds = useMemo(
    () => collectScopedNodeIds(activeBoard, selectedNodeId),
    [activeBoard, selectedNodeId],
  )

  const frameAncestors = useMemo(
    () => collectFrameAncestors(activeBoard, workspace, selectedNodeId),
    [activeBoard, workspace, selectedNodeId],
  )

  useFollowCanvasTransform(scopedNodeIds)

  const sources = useMemo(
    () => buildSources(refBindings, rects, scopedNodeIds, frameAncestors),
    [refBindings, rects, scopedNodeIds, frameAncestors],
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
 * Each node under the selection mapped to the frame that stands in for it.
 *
 * A frame's contents are reported by one chip on the frame rather than a chip per ref,
 * so a component built out of frames reads as its frames first. The frame chosen is the
 * highest one under the selection, so clicking it selects that frame and the overlay
 * redraws one level in. Nodes with no frame above them are absent and draw their own
 * chips.
 *
 * A frame's own ref is not part of its contents, so it keeps its own chip.
 *
 * The level comes from `getEffectiveNodeLevel` rather than the resolved catalog id,
 * because an authored module can be built on the frame schema. Such a node reports
 * `frame` as its catalog id while being a module, and summarizing it would fold a whole
 * component into one chip.
 */
function collectFrameAncestors(
  board: Board | null,
  workspace: Workspace,
  selectedNodeId: string | null,
): Map<string, string> {
  if (!board || !selectedNodeId) return new Map()

  const frames = new Set<string>()

  walkComponentTree(board, (ref) => {
    const node = workspace.nodes?.[ref.id]

    if (node && getEffectiveNodeLevel(node, workspace) === ComponentLevel.FRAME) {
      frames.add(ref.id)
    }
  })

  if (frames.size === 0) return new Map()

  const parents = getParentNodeIds(board)
  const summarizedBy = new Map<string, string>()

  for (const nodeId of parents.keys()) {
    let current = parents.get(nodeId)
    let topmost: string | null = null

    while (current && current !== selectedNodeId) {
      if (frames.has(current)) {
        topmost = current
      }

      current = parents.get(current)
    }

    if (topmost) {
      summarizedBy.set(nodeId, topmost)
    }
  }

  return summarizedBy
}

/**
 * The chips worth drawing: one per ref, and one per frame holding refs.
 *
 * Only nodes the canvas is tracking get a connector, so a node that is not on screen
 * is not pointed at. A stale binding has no workspace node, so there is nothing to
 * anchor to and it is left to the sidebar to report.
 */
function buildSources(
  bindings: RefBinding[],
  rects: Record<string, NodeRect | null>,
  scopedNodeIds: Set<string>,
  frameAncestors: Map<string, string>,
): ConnectorSource[] {
  const sources: ConnectorSource[] = []
  const summarized = new Map<string, RefBinding[]>()

  for (const binding of bindings) {
    const nodeId = binding.node?.nodeId

    if (!nodeId) continue
    if (!scopedNodeIds.has(nodeId)) continue

    const frameId = frameAncestors.get(nodeId)
    const frameRect = frameId ? rects[frameId] : null

    if (frameId && frameRect) {
      const group = summarized.get(frameId) ?? []

      group.push(binding)
      summarized.set(frameId, group)
      continue
    }

    const rect = rects[nodeId]

    if (!rect) continue

    sources.push({
      key: binding.ref,
      label: binding.ref,
      rect,
      muted: binding.state !== "bound",
      order: REF_ORDER,
    })
  }

  for (const [frameId, group] of summarized) {
    const rect = rects[frameId]

    if (!rect) continue

    sources.push({
      key: `${FRAME_KEY_PREFIX}${frameId}`,
      label: getSummaryLabel(group.length),
      rect,
      muted: group.every((binding) => binding.state !== "bound"),
      order: SUMMARY_ORDER,
    })
  }

  return sources
}

function getSummaryLabel(count: number): string {
  if (count === 1) return "1 Reference"

  return `${count} References`
}

/** Pairs each placement back to the ref or the frame it was built from. */
function buildEntries(placements: ConnectorPlacement[], bindings: RefBinding[]): PlacedConnector[] {
  const byRef = new Map(bindings.map((binding) => [binding.ref, binding]))
  const entries: PlacedConnector[] = []

  for (const placement of placements) {
    if (placement.key.startsWith(FRAME_KEY_PREFIX)) {
      entries.push({
        kind: "frame",
        placement,
        nodeId: placement.key.slice(FRAME_KEY_PREFIX.length),
      })
      continue
    }

    const binding = byRef.get(placement.key)

    if (binding) {
      entries.push({ kind: "ref", placement, binding })
    }
  }

  return entries
}
