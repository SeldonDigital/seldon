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
