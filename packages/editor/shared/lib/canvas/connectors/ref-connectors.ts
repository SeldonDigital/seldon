import { ComponentLevel } from "@seldon/core/components/constants"
import { getEffectiveNodeLevel } from "@seldon/core/workspace/helpers/nodes/get-effective-node-level"
import {
  collectDescendantNodeIds,
  getParentNodeIds,
  walkComponentTree,
} from "../../workspace/component-tree"

import type { RefBinding } from "../../refs/join-refs-and-bindings"
import type { NodeRect } from "../overlay/geometry"
import type { ConnectorPlacement, ConnectorSource } from "./connector-layout"
import type { Board, EntryNodeId, Workspace } from "@seldon/core/workspace/types"

/**
 * Which badges the overlay draws for a selection, and what each one reports.
 *
 * Everything here is a plain function of the workspace, the bindings, and the
 * measured node rects, so both editors place the same badges from the same
 * inputs. Only the reactive wiring differs per framework.
 */

/**
 * One placed connector and what its badge reports.
 *
 * A `ref` entry names one ref and opens its card. A `summary` entry stands for the refs
 * one node holds, which are not drawn one by one, and selects that node instead.
 */
export type PlacedConnector =
  | { kind: "ref"; placement: ConnectorPlacement; binding: RefBinding }
  | { kind: "summary"; placement: ConnectorPlacement; nodeId: string }

/** Marks a source as standing for a node's contents rather than for one ref. */
const SUMMARY_KEY_PREFIX = "summary:"

/** Badges for one node read in this order, the node's own ref before its summary. */
const REF_ORDER = 0
const SUMMARY_ORDER = 1

/**
 * The selected node and everything under it.
 *
 * Descendants are included because a component's refs mostly sit on its children,
 * so selecting the component is what shows its wiring. An empty set means nothing
 * is selected, and no connector draws.
 */
export function collectScopedNodeIds(
  board: Board | null,
  selectedNodeId: string | null,
): Set<string> {
  if (!board || !selectedNodeId) return new Set()

  const descendants = collectDescendantNodeIds(board, selectedNodeId as EntryNodeId)

  return new Set<string>([selectedNodeId, ...descendants])
}

/** The nodes a ref points at, which is what makes a node worth summarizing onto. */
export function collectReferencedNodeIds(bindings: RefBinding[]): Set<string> {
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
 * One badge counting the refs inside says the same thing with one line.
 *
 * A node with no ref of its own summarizes nothing, since a single run to a node inside
 * it sits on no other run and counting it would hide a name for nothing.
 *
 * The node chosen is the highest one under the selection, so clicking it selects that
 * node and the overlay redraws one level in. Nodes with nothing above them are absent
 * and draw their own badges.
 *
 * Only nodes inside the selection stand in for anything. The climb stops where the
 * selection does, because a node above it is not on screen as part of what was asked
 * about, and summarizing onto one would point the badge away from the selection and up
 * the tree. A selected node carrying its own ref therefore draws its own badge.
 *
 * A node's own ref is not part of its contents, so it keeps its own badge beside the
 * summary.
 *
 * The level comes from `getEffectiveNodeLevel` rather than the resolved catalog id,
 * because an authored module can be built on the frame schema. Such a node reports
 * `frame` as its catalog id while being a module, and summarizing it would fold a whole
 * component into one badge.
 */
export function collectSummaryNodes(
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
 * The badges worth drawing: one per ref, and one per node standing in for the refs it holds.
 *
 * Only nodes the canvas is tracking get a connector, so a node that is not on screen
 * is not pointed at. A stale binding has no workspace node, so there is nothing to
 * anchor to and it is left to the sidebar to report.
 */
export function buildConnectorSources(
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
  // badges selecting it draws rather than how many it is hiding. A frame carrying no ref
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
export function buildPlacedConnectors(
  placements: ConnectorPlacement[],
  bindings: RefBinding[],
): PlacedConnector[] {
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

/**
 * The nodes the drawn connectors meet.
 *
 * A summary badge counts as its own node, since that is where its connector lands. Refs
 * pushed out of the column are absent, because nothing is pointing at them.
 */
export function collectAnchoredNodeIds(entries: PlacedConnector[]): string[] {
  const nodeIds: string[] = []

  for (const entry of entries) {
    if (entry.kind === "summary") {
      nodeIds.push(entry.nodeId)
      continue
    }

    const nodeId = entry.binding.node?.nodeId

    if (nodeId) {
      nodeIds.push(nodeId)
    }
  }

  return nodeIds
}
