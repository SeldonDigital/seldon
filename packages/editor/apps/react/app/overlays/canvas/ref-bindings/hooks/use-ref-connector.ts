"use client"

import { useSharedStore } from "@app/canvas/hooks/use-shared-store"
import { useRefBindings } from "@app/refs/use-ref-bindings"
import { useActiveBoard } from "@app/workspace/hooks/use-active-board"
import { useSelectedNodeId } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import {
  getGutterSide,
  layoutConnectors,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { nodeRectsStore } from "@seldon/editor/lib/canvas/tracking/node-rects-store"
import {
  collectDescendantNodeIds,
  getParentNodeIds,
  walkComponentTree,
} from "@seldon/editor/lib/workspace/component-tree"
import { useMemo, useRef } from "react"

import { ComponentLevel } from "@seldon/core/components/constants"
import { getEffectiveNodeLevel } from "@seldon/core/workspace/helpers/nodes/get-effective-node-level"

import { useCanvasSize } from "../../../hooks/use-canvas-size"
import { useConnectorMetrics } from "./use-connector-metrics"
import { useFollowCanvasTransform } from "./use-follow-canvas-transform"

import type { Board, EntryNodeId, Workspace } from "@seldon/core/workspace/types"
import type {
  ConnectorLayoutResult,
  ConnectorPlacement,
  ConnectorSource,
  GutterSide,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { NodeRect } from "@seldon/editor/lib/canvas/overlay/geometry"
import type { RefBinding } from "@seldon/editor/lib/refs/join-refs-and-bindings"
import type { RefObject } from "react"

/**
 * One placed connector and what its chip reports.
 *
 * A `ref` entry names one ref and opens its card. A `summary` entry stands for the refs
 * one node holds, which are not drawn one by one, and selects that node instead.
 */
export type PlacedConnector =
  | { kind: "ref"; placement: ConnectorPlacement; binding: RefBinding }
  | { kind: "summary"; placement: ConnectorPlacement; nodeId: string }

interface RefConnectorState {
  entries: PlacedConnector[]
  canvasSize: { width: number; height: number }
  omitted: number
  omittedChip: ConnectorLayoutResult["omittedChip"]
  /** The dot where a connector meets its node, `0` until the metrics are read. */
  anchorRadius: number
  /** Every chip's label, and the element the metrics are read from. */
  labels: string[]
  measureRef: RefObject<HTMLElement | null>
}

/** Marks a source as standing for a node's contents rather than for one ref. */
const SUMMARY_KEY_PREFIX = "summary:"

/** Chips for one node read in this order, the node's own ref before its summary. */
const REF_ORDER = 0
const SUMMARY_ORDER = 1

/** Stands in until the chips have been measured, which is what the column places by. */
const NOTHING_PLACED: ConnectorLayoutResult = {
  placements: [],
  omitted: 0,
  omittedChip: null,
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
  const { workspace } = useWorkspace()
  // The rect map is written in place, so its version is what says a node has moved.
  const rectsVersion = useSharedStore(nodeRectsStore, (state) => state.version)
  const canvasSize = useCanvasSize()
  const gutterSide = useRef<GutterSide>("right")

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
    () => buildSources(refBindings, nodeRectsStore.getState().rects, scopedNodeIds, summaryNodes),
    [refBindings, rectsVersion, scopedNodeIds, summaryNodes],
  )

  const labels = useMemo(() => sources.map((source) => source.label), [sources])
  const { metrics, measureRef } = useConnectorMetrics(labels)

  // The chip's own gap spaces the column as well, both between chips and off the canvas
  // top and bottom, so the spacing follows the chip rather than a number kept here.
  //
  // The edge the column hangs off is carried between frames, because moving it takes a
  // clear win over where it already is. See `getGutterSide`.
  const layout = useMemo(() => {
    if (!metrics) return NOTHING_PLACED

    const side = getGutterSide(
      sources,
      { canvasWidth: canvasSize.width, gutter: metrics.gutter },
      gutterSide.current,
    )

    gutterSide.current = side

    return layoutConnectors(sources, {
      canvasWidth: canvasSize.width,
      canvasHeight: canvasSize.height,
      chipWidth: metrics.chipWidth,
      chipHeight: metrics.chipHeight,
      chipGap: metrics.chipGap,
      margin: metrics.chipGap,
      gutter: metrics.gutter,
      side,
    })
  }, [sources, canvasSize.width, canvasSize.height, metrics])

  const entries = useMemo(
    () => buildEntries(layout.placements, refBindings),
    [layout.placements, refBindings],
  )

  return {
    entries,
    canvasSize,
    omitted: layout.omitted,
    omittedChip: layout.omittedChip,
    anchorRadius: metrics?.anchorRadius ?? 0,
    labels,
    measureRef,
  }
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

/** The nodes a ref points at, which is what makes a node worth summarizing onto. */
function collectReferencedNodeIds(bindings: RefBinding[]): Set<string> {
  const nodeIds = new Set<string>()

  for (const binding of bindings) {
    if (binding.node?.nodeId) {
      nodeIds.add(binding.node.nodeId)
    }
  }

  return nodeIds
}

/**
 * Each node under the selection mapped to the node that stands in for it.
 *
 * Two kinds of node stand in for the refs beneath them. A frame does, so a component
 * built out of frames reads as its frames first. A node carrying a ref of its own does
 * too, because its connector leaves from its center and a ref on a node inside it leaves
 * from a center on the same line, so the two runs would be drawn on top of each other.
 * One chip counting the refs inside says the same thing with one line.
 *
 * A node with no ref of its own summarizes nothing, since a single run to a node inside
 * it sits on no other run and counting it would hide a name for nothing.
 *
 * The node chosen is the highest one under the selection, so clicking it selects that
 * node and the overlay redraws one level in. Nodes with nothing above them are absent
 * and draw their own chips.
 *
 * Only nodes inside the selection stand in for anything. The climb stops where the
 * selection does, because a node above it is not on screen as part of what was asked
 * about, and summarizing onto one would point the chip away from the selection and up
 * the tree. A selected node carrying its own ref therefore draws its own chip.
 *
 * A node's own ref is not part of its contents, so it keeps its own chip beside the
 * summary.
 *
 * The level comes from `getEffectiveNodeLevel` rather than the resolved catalog id,
 * because an authored module can be built on the frame schema. Such a node reports
 * `frame` as its catalog id while being a module, and summarizing it would fold a whole
 * component into one chip.
 */
function collectSummaryNodes(
  board: Board | null,
  workspace: Workspace,
  selectedNodeId: string | null,
  scopedNodeIds: Set<string>,
  referencedNodeIds: Set<string>,
): Map<string, string> {
  if (!board || !selectedNodeId) return new Map()

  const canSummarize = new Set<string>(referencedNodeIds)

  walkComponentTree(board, (ref) => {
    const node = workspace.nodes?.[ref.id]

    if (node && getEffectiveNodeLevel(node, workspace) === ComponentLevel.FRAME) {
      canSummarize.add(ref.id)
    }
  })

  if (canSummarize.size === 0) return new Map()

  const parents = getParentNodeIds(board)
  const summarizedBy = new Map<string, string>()

  for (const nodeId of scopedNodeIds) {
    let current = parents.get(nodeId)
    let topmost: string | null = null

    while (current && current !== selectedNodeId && scopedNodeIds.has(current)) {
      if (canSummarize.has(current)) {
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
 * The chips worth drawing: one per ref, and one per node standing in for the refs it holds.
 *
 * Only nodes the canvas is tracking get a connector, so a node that is not on screen
 * is not pointed at. A stale binding has no workspace node, so there is nothing to
 * anchor to and it is left to the sidebar to report.
 */
function buildSources(
  bindings: RefBinding[],
  rects: Map<string, NodeRect | null>,
  scopedNodeIds: Set<string>,
  summaryNodes: Map<string, string>,
): ConnectorSource[] {
  const sources: ConnectorSource[] = []
  const summarized = new Map<string, RefBinding[]>()
  const drawn = new Map<string, RefBinding[]>()

  for (const binding of bindings) {
    const nodeId = binding.node?.nodeId

    if (!nodeId) continue
    if (!scopedNodeIds.has(nodeId)) continue

    const summaryId = summaryNodes.get(nodeId)
    const summaryRect = summaryId ? rects.get(summaryId) : null

    if (summaryId && summaryRect) {
      const group = summarized.get(summaryId) ?? []

      group.push(binding)
      summarized.set(summaryId, group)
      continue
    }

    const rect = rects.get(nodeId)

    if (!rect) continue

    drawn.set(nodeId, [...(drawn.get(nodeId) ?? []), binding])

    sources.push({
      key: binding.ref,
      label: binding.ref,
      rect,
      muted: binding.state !== "bound",
      order: REF_ORDER,
    })
  }

  // A summarizing node's own ref counts toward its summary, so the count says how many
  // chips selecting it draws rather than how many it is hiding. A frame carrying no ref
  // has nothing to add, which is why a frame's count already read that way.
  for (const [summaryId, group] of summarized) {
    const rect = rects.get(summaryId)

    if (!rect) continue

    const counted = [...(drawn.get(summaryId) ?? []), ...group]

    sources.push({
      key: `${SUMMARY_KEY_PREFIX}${summaryId}`,
      label: getSummaryLabel(counted.length),
      rect,
      muted: counted.every((binding) => binding.state !== "bound"),
      order: SUMMARY_ORDER,
    })
  }

  return sources
}

function getSummaryLabel(count: number): string {
  if (count === 1) return "1 Reference"

  return `${count} References`
}

/** Pairs each placement back to the ref or the node it was built from. */
function buildEntries(placements: ConnectorPlacement[], bindings: RefBinding[]): PlacedConnector[] {
  const byRef = new Map(bindings.map((binding) => [binding.ref, binding]))
  const entries: PlacedConnector[] = []

  for (const placement of placements) {
    if (placement.key.startsWith(SUMMARY_KEY_PREFIX)) {
      entries.push({
        kind: "summary",
        placement,
        nodeId: placement.key.slice(SUMMARY_KEY_PREFIX.length),
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
