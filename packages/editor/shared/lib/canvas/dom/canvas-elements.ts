import type { ComponentId } from "@seldon/core/components/constants"
import type { InstanceId, VariantId } from "@seldon/core/workspace/types"

/** The canvas element that all node rects are measured relative to. */
export function getCanvasElement(): HTMLElement | null {
  return document.getElementById("canvas")
}

export function getHtmlElementByNodeId(nodeId: string): HTMLElement | null {
  return document.querySelector(`[data-canvas-node-id="${nodeId}"]`)
}

export function getHtmlElementByBoardId(boardId: ComponentId): HTMLElement | null {
  return document.querySelector(`[data-board-id="${boardId}"]`)
}

/**
 * How much the canvas zoom scales an element's rendered pixels over its layout
 * pixels. Screen distances divided by this land in the element's own space.
 */
export function getRenderedScale(element: HTMLElement): number {
  const layoutWidth = element.offsetWidth

  if (!layoutWidth) return 1

  const scale = element.getBoundingClientRect().width / layoutWidth

  return scale > 0 ? scale : 1
}

/** Walks up the DOM to the nearest element carrying `data-canvas-node-id`. */
export function getNodeIdForEventTarget(element: HTMLElement): InstanceId | VariantId | null {
  let current: HTMLElement | null = element

  while (current) {
    const nodeId = current.getAttribute("data-canvas-node-id")

    if (nodeId) {
      return nodeId as InstanceId | VariantId
    }

    current = current.parentElement
  }

  return null
}
