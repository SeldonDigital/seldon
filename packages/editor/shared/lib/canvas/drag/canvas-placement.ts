import { nodeTraversalService } from "@seldon/core/workspace/services"
import { canNodeAcceptChildren } from "../../workspace/can-node-accept-children"
import { getNodeOrientation } from "../../workspace/get-node-orientation"
import { getNodeIdForEventTarget } from "../dom/canvas-elements"

import type { Placement } from "../../types"
import type { Instance, Variant, Workspace } from "@seldon/core"

/** Share of a node's length along the flow axis that reads as its edge. */
const EDGE_BAND_RATIO = 0.25

/** Edge band limits in px, so a tiny node stays aimable and a large one stays mostly nestable. */
const MIN_EDGE_BAND_PX = 4
const MAX_EDGE_BAND_PX = 24

export interface CanvasDropTarget {
  target: Variant | Instance
  placement: Placement
  /** The copy of `target` under the cursor, which the indicator draws against. */
  element: HTMLElement
  /** Flow axis of the list `target` sits in. */
  axis: "horizontal" | "vertical"
}

/**
 * Where a canvas drag would drop, resolved from the pointer position.
 *
 * A node's own box carries the same placements the objects sidebar puts in its
 * row bands, laid out along the flow axis of the list the node sits in. Its
 * leading edge means `before` it, its trailing edge means `after` it, and the
 * space between means `inside` it. A node that cannot take children splits in
 * half and has no `inside`.
 *
 * Both edges are offered here, unlike a sidebar row, because an edge in space is
 * unambiguous: the trailing edge of a node and the leading edge of its next
 * sibling are separated by the gap between them, not shared like a row boundary.
 * The two express the same slot and the same rules judge both.
 *
 * Reading the live DOM rather than the tracked rects keeps the result correct
 * under zoom, pan, and a reorder animation in flight.
 */
export function resolveCanvasPlacement(
  point: { x: number; y: number },
  subject: Variant | Instance,
  workspace: Workspace,
): CanvasDropTarget | null {
  const deepest = findNodeElementAtPoint(point, () => true)

  if (!deepest) return null
  if (isSubjectElement(deepest, subject.id)) return null

  // A preview may have drawn a node the committed workspace does not know, such
  // as the copy an Alt-drag just added. Aim at the nearest node it does know.
  const hovered = workspace.nodes[deepest.nodeId]
    ? deepest
    : findNodeElementAtPoint(point, (nodeId) => workspace.nodes[nodeId] !== undefined)

  if (!hovered) return null

  const target = workspace.nodes[hovered.nodeId] as Variant | Instance | undefined

  if (!target) return null

  const canNest = canNodeAcceptChildren(target, workspace)
  const parent = findParentNode(target, workspace)

  // A node with no list around it, such as a variant root, only takes children.
  if (!parent) {
    if (!canNest) return null

    return {
      target,
      placement: "inside",
      element: hovered.element,
      axis: "vertical",
    }
  }

  const axis = getNodeOrientation(parent.id, workspace)
  const rect = hovered.element.getBoundingClientRect()
  const offset = axis === "horizontal" ? point.x - rect.left : point.y - rect.top
  const size = axis === "horizontal" ? rect.width : rect.height
  const band = canNest ? getEdgeBand(size) : size / 2

  if (offset < band) {
    return {
      target,
      placement: "before",
      element: hovered.element,
      axis,
    }
  }

  if (offset > size - band) {
    return {
      target,
      placement: "after",
      element: hovered.element,
      axis,
    }
  }

  if (!canNest) return null

  return {
    target,
    placement: "inside",
    element: hovered.element,
    axis,
  }
}

/**
 * Whether the deepest node under the point is `nodeId` or one of its children.
 *
 * A drag uses this to hold its current slot. Once the preview lands, the dragged
 * node sits in the slot the cursor chose, so the cursor is often over the node
 * itself. Reading that as no slot at all would roll the preview back, put the node
 * where it started, and offer the slot again on the next movement.
 */
export function isPointOverNode(point: { x: number; y: number }, nodeId: string): boolean {
  const deepest = findNodeElementAtPoint(point, () => true)

  if (!deepest) return false

  return isSubjectElement(deepest, nodeId)
}

function isSubjectElement(
  hit: { nodeId: string; element: HTMLElement },
  subjectId: string,
): boolean {
  if (hit.nodeId === subjectId) return true

  return hit.element.closest(`[data-canvas-node-id="${subjectId}"]`) !== null
}

function getEdgeBand(size: number): number {
  return Math.min(Math.max(size * EDGE_BAND_RATIO, MIN_EDGE_BAND_PX), MAX_EDGE_BAND_PX)
}

/**
 * The deepest accepted node under the point. Walking outward from there lets a
 * caller pass over the dragged subtree, so a node is never dropped into itself,
 * and over a node the committed workspace does not know, such as a copy an
 * Alt-drag preview just added, landing on its container instead.
 *
 * Elements painted over the canvas are non-interactive, so a hit test does not
 * see them.
 */
function findNodeElementAtPoint(
  point: { x: number; y: number },
  accept: (nodeId: string, element: HTMLElement) => boolean,
): { nodeId: string; element: HTMLElement } | null {
  const stack = document.elementsFromPoint(point.x, point.y)

  for (const candidate of stack) {
    if (!(candidate instanceof HTMLElement)) continue

    const nodeId = getNodeIdForEventTarget(candidate)

    if (!nodeId) continue

    const element = candidate.closest<HTMLElement>(`[data-canvas-node-id="${nodeId}"]`)

    if (!element || !accept(nodeId, element)) continue

    return { nodeId, element }
  }

  return null
}

function findParentNode(node: Variant | Instance, workspace: Workspace): Variant | Instance | null {
  try {
    return nodeTraversalService.findParentNode(node.id, workspace)
  } catch {
    return null
  }
}
