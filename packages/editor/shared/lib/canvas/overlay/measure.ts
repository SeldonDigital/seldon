import { invariant } from "@seldon/core/index"
import { getCanvasElement, getHtmlElementByNodeId } from "../dom/canvas-elements"
import {
  getCanvasSelectionElements,
  getScopedSelectionElement,
  getUnionRect,
} from "./selection-target"

import type { NodeRect } from "./geometry"

/**
 * Position and size of a node element relative to the canvas. Coordinates are
 * relative to the canvas element's top-left corner.
 */
export function calculateSelectionOutline({ nodeEl }: { nodeEl: HTMLElement }): NodeRect {
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

const BOARD_SELECTOR = "[data-board-id]"

/** The sides an element's clipping ancestors hold it within. */
interface ClipBounds {
  top: number
  left: number
  right: number
  bottom: number
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

  return clipToAncestors(nodeEl, rect)
}

/**
 * The part of a rect that its clipping ancestors leave visible, or null when they
 * leave nothing. Takes the element itself, so a node drawn in several places is
 * clipped against the copy being measured rather than the first one in the page.
 */
function clipToAncestors(element: HTMLElement, rect: NodeRect): NodeRect | null {
  const bounds = getClipBounds(element, null)
  const top = Math.max(rect.top, bounds.top)
  const left = Math.max(rect.left, bounds.left)
  const right = Math.min(rect.left + rect.width, bounds.right)
  const bottom = Math.min(rect.top + rect.height, bounds.bottom)

  if (right - left <= 0 || bottom - top <= 0) return null

  return { top, left, width: right - left, height: bottom - top }
}

/**
 * A rect held inside what its own board shows.
 *
 * A node scrolled out of view inside a board flattens against the edge it went
 * past instead of being dropped, so a connector still points into where it went.
 * Clipping above the board is ignored, which is what keeps panning and zooming
 * from moving anchors around: a node off the side of the canvas keeps its place
 * and its line simply runs off with it.
 */
export function clampRectToBoard(element: HTMLElement, rect: NodeRect): NodeRect {
  const bounds = getClipBounds(element, element.closest(BOARD_SELECTOR))
  const top = clamp(rect.top, bounds.top, bounds.bottom)
  const left = clamp(rect.left, bounds.left, bounds.right)
  const right = clamp(rect.left + rect.width, bounds.left, bounds.right)
  const bottom = clamp(rect.top + rect.height, bounds.top, bounds.bottom)

  return { top, left, width: right - left, height: bottom - top }
}

/**
 * What the clipping ancestors of an element allow, walking up to `boundary` when
 * one is given and to the canvas otherwise. Unclipped sides stay unbounded.
 */
function getClipBounds(element: HTMLElement, boundary: Element | null): ClipBounds {
  const canvasEl = getCanvasElement()
  const bounds: ClipBounds = {
    top: -Infinity,
    left: -Infinity,
    right: Infinity,
    bottom: Infinity,
  }

  if (!canvasEl) return bounds

  let ancestor = element.parentElement

  while (ancestor && ancestor !== canvasEl) {
    if (isClippingAncestor(ancestor)) {
      const rect = calculateSelectionOutline({ nodeEl: ancestor })

      bounds.top = Math.max(bounds.top, rect.top)
      bounds.left = Math.max(bounds.left, rect.left)
      bounds.right = Math.min(bounds.right, rect.left + rect.width)
      bounds.bottom = Math.min(bounds.bottom, rect.top + rect.height)
    }

    if (ancestor === boundary) break

    ancestor = ancestor.parentElement
  }

  return bounds
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
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
export function measureNode(id: string | null, rootId: string | null): NodeRect | null {
  if (!id) return null
  const element = getScopedSelectionElement(id, rootId)

  return toCanvasRect(element ? element.getBoundingClientRect() : null)
}

export function rectsEqual(a: NodeRect | null, b: NodeRect | null): boolean {
  if (a === b) return true
  if (!a || !b) return false

  return a.top === b.top && a.left === b.left && a.width === b.width && a.height === b.height
}
