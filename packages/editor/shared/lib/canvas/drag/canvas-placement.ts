import { canNodeAcceptChildren } from "../../workspace/can-node-accept-children"
import { getNodeOrientation } from "../../workspace/get-node-orientation"
import { getNodeIdForEventTarget } from "../dom/canvas-elements"
import { findSlotContainer, getSlotContainerChildIds } from "./drop-slot"

import type { CanvasDropSlot, SlotContainer } from "./drop-slot"
import type { Instance, Variant, Workspace } from "@seldon/core"
import type { ComponentId } from "@seldon/core/components/constants"
import type { EntryNodeId } from "@seldon/core/workspace/types"

/** Share of a wireframe box, measured in from each edge, that targets the node itself. */
const EDGE_BAND_RATIO = 0.15

/** Nodes and boards both hold children, so a hit test stops at either. */
const CONTAINER_SELECTOR = "[data-canvas-node-id], [data-board-id]"

/**
 * What a canvas drag or an insert hover points at.
 *
 * `hold` keeps whatever slot was last found, because the cursor is over a node
 * but not over one of its bands, so sweeping across content leaves the current
 * slot alone. `away` means the cursor left the canvas content altogether.
 */
export type CanvasPlacement =
  | { kind: "slot"; slot: CanvasDropSlot }
  | { kind: "hold" }
  | { kind: "away" }

/**
 * Where a drop would land, resolved from the pointer position.
 *
 * Every wireframe box carries a band 15% deep inside each of its edges. Within
 * that band the drop lands beside the node, before or after it by which half of
 * the flow axis the cursor is on. Past the band it lands inside the node. Two
 * touching siblings therefore share a buffer of 15% on each side of their common
 * border, and nesting asks for a deliberate aim into the middle.
 *
 * A node's interior belongs to its children, so a point in the space between two
 * of them lands between them. A board works the same way for the variants on it,
 * which is how a variant reaches a slot beside its siblings.
 *
 * Pass the dragged node as `subject` to keep a drag off its own subtree. An
 * insert hover has no subject and passes `null`.
 *
 * Reading the live DOM rather than the tracked rects keeps the result correct
 * under zoom, pan, and a reorder animation in flight.
 */
export function resolveCanvasPlacement(
  point: { x: number; y: number },
  subject: Variant | Instance | null,
  workspace: Workspace,
): CanvasPlacement {
  // A dragged node stays in the place it was picked up from, so the hit test
  // passes over it and reads whatever its box is covering.
  const isOutsideSubject = (hit: NodeElement) => !subject || !isSubjectElement(hit, subject.id)
  const deepest = findNodeElementAtPoint(point, isOutsideSubject)

  if (!deepest) return resolveBoardPlacement(point, workspace)

  // A preview may have drawn a node the committed workspace does not know. Aim at
  // the nearest node it does know.
  const hovered = workspace.nodes[deepest.nodeId as EntryNodeId]
    ? deepest
    : findNodeElementAtPoint(
        point,
        (hit) => workspace.nodes[hit.nodeId as EntryNodeId] !== undefined && isOutsideSubject(hit),
      )

  if (!hovered) return { kind: "away" }

  const target = workspace.nodes[hovered.nodeId as EntryNodeId] as Variant | Instance | undefined

  if (!target) return { kind: "away" }

  const container = findSlotContainer(target, workspace)
  const rect = hovered.element.getBoundingClientRect()
  const canNest = canNodeAcceptChildren(target, workspace)

  // A node that takes no children reads as one boundary, so all of its box stays
  // aimable. One that does keeps its middle for nesting and only the band inside
  // its edges for its own slot.
  const ownSlot = canNest ? isPointInEdgeBand(point, rect) : true

  if (ownSlot && container) {
    const axis = getNodeOrientation(container.id as ComponentId, workspace)

    return {
      kind: "slot",
      slot: buildEdgeSlot(target, container, getNearerEdge(point, rect, axis), workspace),
    }
  }

  if (!canNest) return { kind: "hold" }

  const slot = resolveContainerSlot(
    point,
    hovered.element,
    { id: target.id, type: "node" },
    workspace,
  )

  return slot ? { kind: "slot", slot } : { kind: "hold" }
}

/**
 * The slot for a point that missed every node. A board holds the variants on it,
 * so its own space between them is a slot the same way a container's is.
 */
function resolveBoardPlacement(
  point: { x: number; y: number },
  workspace: Workspace,
): CanvasPlacement {
  const board = findBoardElementAtPoint(point)

  if (!board) return { kind: "away" }

  const slot = resolveContainerSlot(
    point,
    board.element,
    { id: board.boardKey, type: "board" },
    workspace,
  )

  return slot ? { kind: "slot", slot } : { kind: "away" }
}

/**
 * The slot for a point in a container's own space. The space between two children
 * lands between them, and the space beside one lands on the nearer of its edges.
 * A container with nothing in it takes the drop at its leading edge.
 *
 * Children the committed workspace does not know are passed over, so a copy an
 * Alt-drag preview added does not stop the space around it from being aimed at.
 */
function resolveContainerSlot(
  point: { x: number; y: number },
  containerElement: HTMLElement,
  container: SlotContainer,
  workspace: Workspace,
): CanvasDropSlot | null {
  const known = new Set(getSlotContainerChildIds(container, workspace))
  const children = getChildElements(containerElement).filter((child) => known.has(child.nodeId))

  if (children.length === 0) {
    return {
      containerId: container.id,
      containerType: container.type,
      boundaryChildId: null,
      placement: "before",
    }
  }

  const axis = getNodeOrientation(container.id as ComponentId, workspace)
  const offset = axis === "horizontal" ? point.x : point.y
  let previous: NodeElement | null = null

  for (const child of children) {
    const rect = child.element.getBoundingClientRect()
    const start = axis === "horizontal" ? rect.left : rect.top
    const end = axis === "horizontal" ? rect.right : rect.bottom

    if (offset < start) return buildBoundarySlot(container, previous)

    // Level with a child rather than between two of them, so the point sits in
    // the space beside it and lands on the edge it is nearer to.
    if (offset <= end) {
      return offset < start + (end - start) / 2
        ? buildBoundarySlot(container, previous)
        : buildBoundarySlot(container, child)
    }

    previous = child
  }

  return buildBoundarySlot(container, previous)
}

/** A slot beside `target`, expressed against the container that holds it. */
function buildEdgeSlot(
  target: Variant | Instance,
  container: SlotContainer,
  side: "before" | "after",
  workspace: Workspace,
): CanvasDropSlot {
  if (side === "after") {
    return {
      containerId: container.id,
      containerType: container.type,
      boundaryChildId: target.id,
      placement: "after",
    }
  }

  const children = getSlotContainerChildIds(container, workspace)
  const index = children.indexOf(target.id)
  const boundaryChildId = index > 0 ? children[index - 1] : null

  return {
    containerId: container.id,
    containerType: container.type,
    boundaryChildId,
    placement: boundaryChildId ? "after" : "before",
  }
}

function buildBoundarySlot(container: SlotContainer, boundary: NodeElement | null): CanvasDropSlot {
  return {
    containerId: container.id,
    containerType: container.type,
    boundaryChildId: boundary?.nodeId ?? null,
    placement: boundary ? "after" : "before",
  }
}

/** Which of the node's two edges along the flow axis the point is nearer to. */
function getNearerEdge(
  point: { x: number; y: number },
  rect: DOMRect,
  axis: "horizontal" | "vertical",
): "before" | "after" {
  const offset = axis === "horizontal" ? point.x - rect.left : point.y - rect.top
  const size = axis === "horizontal" ? rect.width : rect.height

  return offset < size / 2 ? "before" : "after"
}

/** Whether the point is within the band inside any edge of the box. */
function isPointInEdgeBand(point: { x: number; y: number }, rect: DOMRect): boolean {
  const insetX = rect.width * EDGE_BAND_RATIO
  const insetY = rect.height * EDGE_BAND_RATIO

  const pastX = point.x > rect.left + insetX && point.x < rect.right - insetX
  const pastY = point.y > rect.top + insetY && point.y < rect.bottom - insetY

  return !pastX || !pastY
}

interface NodeElement {
  nodeId: string
  element: HTMLElement
}

function isSubjectElement(hit: NodeElement, subjectId: string): boolean {
  if (hit.nodeId === subjectId) return true

  return hit.element.closest(`[data-canvas-node-id="${subjectId}"]`) !== null
}

/**
 * The deepest accepted node under the point. Walking outward from there lets a
 * caller pass over the dragged subtree, so a node is never dropped into itself,
 * and over a node the committed workspace does not know, landing on its container
 * instead.
 *
 * Elements painted over the canvas are non-interactive, so a hit test does not
 * see them.
 */
function findNodeElementAtPoint(
  point: { x: number; y: number },
  accept: (hit: NodeElement) => boolean,
): NodeElement | null {
  const stack = document.elementsFromPoint(point.x, point.y)

  for (const candidate of stack) {
    if (!(candidate instanceof HTMLElement)) continue

    const nodeId = getNodeIdForEventTarget(candidate)

    if (!nodeId) continue

    const element = candidate.closest<HTMLElement>(`[data-canvas-node-id="${nodeId}"]`)

    if (!element || !accept({ nodeId, element })) continue

    return { nodeId, element }
  }

  return null
}

function findBoardElementAtPoint(point: {
  x: number
  y: number
}): { boardKey: string; element: HTMLElement } | null {
  const stack = document.elementsFromPoint(point.x, point.y)

  for (const candidate of stack) {
    if (!(candidate instanceof HTMLElement)) continue

    const element = candidate.closest<HTMLElement>("[data-board-id]")
    const boardKey = element?.getAttribute("data-board-id")

    if (!element || !boardKey) continue

    return { boardKey, element }
  }

  return null
}

/** The nodes a container holds directly, in the order it lays them out. */
function getChildElements(container: HTMLElement): NodeElement[] {
  const descendants = Array.from(container.querySelectorAll<HTMLElement>("[data-canvas-node-id]"))
  const children: NodeElement[] = []

  for (const element of descendants) {
    if (element.parentElement?.closest(CONTAINER_SELECTOR) !== container) continue

    const nodeId = element.getAttribute("data-canvas-node-id")

    if (!nodeId) continue

    children.push({ nodeId, element })
  }

  return children
}
