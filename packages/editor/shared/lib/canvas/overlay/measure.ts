import { invariant } from "@seldon/core/index"
import {
  getCanvasElement,
  getHtmlElementByNodeId,
} from "../dom/canvas-elements"
import type { NodeRect } from "./geometry"
import {
  getCanvasSelectionElements,
  getScopedSelectionElement,
  getUnionRect,
} from "./selection-target"

/**
 * Position and size of a node element relative to the canvas. Coordinates are
 * relative to the canvas element's top-left corner.
 */
export function calculateSelectionOutline({
  nodeEl,
}: {
  nodeEl: HTMLElement
}): NodeRect {
  const canvasEl = getCanvasElement()
  invariant(canvasEl, "canvas element not found")
  const elementRect = nodeEl.getBoundingClientRect()
  const canvasRect = canvasEl.getBoundingClientRect()
  return {
    top: elementRect.top - canvasRect.top,
    left: elementRect.left - canvasRect.left,
    width: elementRect.width,
    height: elementRect.height,
  }
}

/** True when the element clips its overflow on either axis. */
function isClippingAncestor(el: HTMLElement): boolean {
  const { overflowX, overflowY } = window.getComputedStyle(el)
  return overflowX !== "visible" || overflowY !== "visible"
}

/**
 * Clips a node's wireframe rect to every clipping ancestor up to the canvas, so
 * the outline matches what is visible under an ancestor's `overflow: hidden`.
 * Returns null when the node is fully clipped away.
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

  const canvasEl = getCanvasElement()
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

/** Converts a viewport rect to one relative to the canvas origin. */
export function toCanvasRect(rect: DOMRect | null): NodeRect | null {
  if (!rect) return null
  const canvas = getCanvasElement()?.getBoundingClientRect()
  if (!canvas) return null
  return {
    top: rect.top - canvas.top,
    left: rect.left - canvas.left,
    width: rect.width,
    height: rect.height,
  }
}

/** Canvas-relative union rect of every element registered under the id. */
export function measureSelection(id: string | null): NodeRect | null {
  if (!id) return null
  return toCanvasRect(getUnionRect(getCanvasSelectionElements(id)))
}

/**
 * Canvas-relative rect of a single node, scoped to its variant-root column so a
 * child id shared across columns outlines only the clicked copy.
 */
export function measureNode(
  id: string | null,
  rootId: string | null,
): NodeRect | null {
  if (!id) return null
  const element = getScopedSelectionElement(id, rootId)
  return toCanvasRect(element ? element.getBoundingClientRect() : null)
}

export function rectsEqual(a: NodeRect | null, b: NodeRect | null): boolean {
  if (a === b) return true
  if (!a || !b) return false
  return (
    a.top === b.top &&
    a.left === b.left &&
    a.width === b.width &&
    a.height === b.height
  )
}
