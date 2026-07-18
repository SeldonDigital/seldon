import { InstanceId, VariantId } from "@seldon/core/workspace/types"

/**
 * Traverse up the DOM to find an element with a data-canvas-node-id attribute.
 */

export function getNodeIdForEventTarget(
  element: HTMLDivElement,
): InstanceId | VariantId | null {
  let currentElement: HTMLDivElement | null = element

  while (currentElement) {
    const nodeId = currentElement.getAttribute("data-canvas-node-id")
    if (nodeId) {
      return nodeId as InstanceId | VariantId
    }
    currentElement = currentElement.parentElement as HTMLDivElement
  }

  return null
}
