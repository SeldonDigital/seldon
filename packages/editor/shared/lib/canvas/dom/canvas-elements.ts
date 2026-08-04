import type { ComponentId } from "@seldon/core/components/constants"
import type { InstanceId, VariantId } from "@seldon/core/workspace/types"

/** The canvas element that all node rects are measured relative to. */
export function getCanvasElement(): HTMLElement | null {
  return document.getElementById("canvas")
}

/**
 * The canvas layer's top-left in viewport pixels, or the origin when it is not measured.
 *
 * A card rendered into the canvas layer positions absolutely inside it, so a viewport rect
 * is carried into the layer's space by subtracting this. The layer carries no zoom of its
 * own, so this is a plain translation.
 */
export function getCanvasOrigin(): { x: number; y: number } {
  const rect = getCanvasElement()?.getBoundingClientRect()

  return { x: rect?.left ?? 0, y: rect?.top ?? 0 }
}

/**
 * A viewport point in the canvas layer's own space, for a surface positioned absolutely
 * inside it. It reads as the same point while the layer is not measured, so a card placed
 * before the canvas mounts falls back to viewport coordinates.
 */
export function toCanvasLocalPoint(point: { x: number; y: number }): { x: number; y: number } {
  const origin = getCanvasOrigin()

  return { x: point.x - origin.x, y: point.y - origin.y }
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
