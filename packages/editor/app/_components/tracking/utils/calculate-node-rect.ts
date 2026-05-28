import { invariant } from "@seldon/core/index"
import { NodeRect } from "../hooks/use-node-rects-store"

/**
 * Calculates the position and size of a node element relative to the canvas.
 * Returns coordinates relative to the canvas element's top-left corner.
 *
 * @param nodeEl - The HTML element representing the node
 * @returns The node's rectangle relative to the canvas, or throws if canvas not found
 */
export function calculateNodeRect({
  nodeEl,
}: {
  nodeEl: HTMLElement
}): NodeRect {
  const canvasEl = document.getElementById("canvas")
  invariant(canvasEl, "canvas element not found")
  const elementRect = nodeEl.getBoundingClientRect()
  const canvasRect = canvasEl.getBoundingClientRect()
  const top = elementRect.top - canvasRect.top
  const left = elementRect.left - canvasRect.left

  return {
    top,
    left,
    width: elementRect.width,
    height: elementRect.height,
  }
}
