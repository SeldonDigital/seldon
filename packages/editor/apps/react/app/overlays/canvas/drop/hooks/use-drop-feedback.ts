import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import {
  getCanvasElement,
  getHtmlElementByBoardId,
  getHtmlElementByNodeId,
} from "@seldon/editor/lib/canvas/dom/canvas-elements"
import { resolveOutlineColorsForNode } from "@seldon/editor/lib/canvas/overlay/outline-colors"
import { getNodeOrientation } from "@seldon/editor/lib/workspace/get-node-orientation"
import { useEffect, useState } from "react"

import { calculateIndicatorPosition } from "../../helpers/calculate-indicator-position"

import type { Workspace } from "@seldon/core"
import type { ComponentId } from "@seldon/core/components/constants"
import type { CanvasDropSlot } from "@seldon/editor/lib/canvas/drag/drop-slot"

/** Which edge of a sibling box faces the drop boundary. */
export type BoundarySide = "right" | "left" | "top" | "bottom"

interface FeedbackBox {
  top: number
  left: number
  width: number
  height: number
}

export interface SiblingBox extends FeedbackBox {
  boundarySide: BoundarySide
  contrast: string
}

export interface DropFeedbackGeometry {
  /** The line or gap fill marking where the child lands. */
  mark: FeedbackBox
  /** The two nodes touching the boundary, when the drop lands between siblings. */
  siblings: SiblingBox[]
  /** The container taking the child, when the drop lands on its own edge. */
  container: FeedbackBox | null
}

/**
 * Canvas-relative geometry for the drop marks, re-measured every frame.
 *
 * A drag writes a preview and the reorder glides to it, so the boundary this
 * marks keeps moving after the slot is chosen. The tracked rects only refresh
 * once the animation settles, which is too late for a mark the cursor aims with.
 */
export function useDropFeedback(slot: CanvasDropSlot): DropFeedbackGeometry | null {
  const { workspace } = useWorkspace()
  const [geometry, setGeometry] = useState<DropFeedbackGeometry | null>(null)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      const next = measureDropFeedback(slot, workspace)

      setGeometry((current) => (isSameGeometry(current, next) ? current : next))
      frame = requestAnimationFrame(measure)
    }

    frame = requestAnimationFrame(measure)

    return () => cancelAnimationFrame(frame)
  }, [slot, workspace])

  return geometry
}

function measureDropFeedback(
  slot: CanvasDropSlot,
  workspace: Workspace,
): DropFeedbackGeometry | null {
  const canvasElement = getCanvasElement()
  const containerElement =
    slot.containerType === "board"
      ? getHtmlElementByBoardId(slot.containerId as ComponentId)
      : getHtmlElementByNodeId(slot.containerId)

  if (!canvasElement || !containerElement) return null

  const boundaryElement = slot.boundaryChildId ? getHtmlElementByNodeId(slot.boundaryChildId) : null

  const orientation = getNodeOrientation(slot.containerId as ComponentId, workspace)
  const mark = calculateIndicatorPosition({
    orientation,
    placement: slot.placement,
    containerElement,
    childElement: boundaryElement,
    canvasElement,
  })

  const canvasRect = canvasElement.getBoundingClientRect()

  const toBox = (element: HTMLElement): FeedbackBox => {
    const rect = element.getBoundingClientRect()

    return {
      top: rect.top - canvasRect.top,
      left: rect.left - canvasRect.left,
      width: rect.width,
      height: rect.height,
    }
  }

  // A boundary between two siblings is framed by the pair, so the container box
  // would only repeat one of them. Without one the drop lands on the container's
  // own edge, and the box says which container takes it.
  if (!boundaryElement) {
    return {
      mark,
      siblings: [],
      container: toBox(containerElement),
    }
  }

  const nextElement = getNextNodeElement(boundaryElement)
  const leading: BoundarySide = orientation === "horizontal" ? "right" : "bottom"
  const trailing: BoundarySide = orientation === "horizontal" ? "left" : "top"

  const siblings: SiblingBox[] = [
    { ...toBox(boundaryElement), boundarySide: leading, contrast: getContrast(boundaryElement) },
  ]

  if (nextElement) {
    siblings.push({
      ...toBox(nextElement),
      boundarySide: trailing,
      contrast: getContrast(nextElement),
    })
  }

  return {
    mark,
    siblings,
    container: null,
  }
}

/** The node laid out after this one, skipping anything that is not a node. */
function getNextNodeElement(element: HTMLElement): HTMLElement | null {
  let candidate = element.nextElementSibling

  while (candidate) {
    if (candidate instanceof HTMLElement && candidate.hasAttribute("data-canvas-node-id")) {
      return candidate
    }

    candidate = candidate.nextElementSibling
  }

  return null
}

function getContrast(element: HTMLElement): string {
  const nodeId = element.getAttribute("data-canvas-node-id")

  return resolveOutlineColorsForNode(nodeId ?? "").hover
}

function isSameGeometry(
  left: DropFeedbackGeometry | null,
  right: DropFeedbackGeometry | null,
): boolean {
  if (!left || !right) return left === right
  if (!isSameBox(left.mark, right.mark)) return false
  if (!isSameBox(left.container, right.container)) return false
  if (left.siblings.length !== right.siblings.length) return false

  return left.siblings.every((sibling, index) => {
    const other = right.siblings[index]

    return (
      isSameBox(sibling, other) &&
      sibling.boundarySide === other.boundarySide &&
      sibling.contrast === other.contrast
    )
  })
}

function isSameBox(left: FeedbackBox | null, right: FeedbackBox | null): boolean {
  if (!left || !right) return left === right

  return (
    left.top === right.top &&
    left.left === right.left &&
    left.width === right.width &&
    left.height === right.height
  )
}
