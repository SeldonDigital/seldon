import { getHtmlElementByNodeId } from "../../canvas/helpers/get-html-element-by-node-id"
import type { NodeRect } from "../hooks/use-node-rects-store"
import { calculateSelectionOutline } from "./calculate-selection-outline"

/**
 * Clips a node's wireframe rect to every clipping ancestor up to the canvas.
 *
 * Wireframe outlines are positioned from a node's raw bounding box, which
 * ignores an ancestor's `overflow: hidden`. This intersects the node rect with
 * each ancestor that clips its overflow so the outline matches what is visible.
 *
 * @param nodeId - The id of the node whose wireframe is being drawn
 * @param rect - The node's canvas-relative rect
 * @returns The clipped rect, or `null` when fully clipped away
 */
export function calculateClippingBox({
  nodeId,
  rect,
}: {
  nodeId: string
  rect: NodeRect
}): NodeRect | null {
  const nodeEl = getHtmlElementByNodeId(nodeId)
  if (!nodeEl) return rect

  const canvasEl = document.getElementById("canvas")
  if (!canvasEl) return rect

  let top = rect.top
  let left = rect.left
  let right = rect.left + rect.width
  let bottom = rect.top + rect.height

  let ancestor = nodeEl.parentElement
  while (ancestor && ancestor !== canvasEl) {
    if (isClippingAncestor(ancestor)) {
      const ancestorRect = calculateSelectionOutline({ nodeEl: ancestor })
      top = Math.max(top, ancestorRect.top)
      left = Math.max(left, ancestorRect.left)
      right = Math.min(right, ancestorRect.left + ancestorRect.width)
      bottom = Math.min(bottom, ancestorRect.top + ancestorRect.height)
    }
    ancestor = ancestor.parentElement
  }

  const width = right - left
  const height = bottom - top
  if (width <= 0 || height <= 0) return null

  return { top, left, width, height }
}

/** True when the element clips its overflow on either axis. */
function isClippingAncestor(el: HTMLElement): boolean {
  const { overflowX, overflowY } = window.getComputedStyle(el)
  return overflowX !== "visible" || overflowY !== "visible"
}
