import { getHtmlElementByNodeId } from "../dom/canvas-elements"
import { calculateSelectionOutline } from "../overlay/measure"
import { updateNodeRect } from "./node-rects-store"

/**
 * Tracks the position and size of nodes on the canvas. Uses a ResizeObserver per
 * node for size changes and window scroll/resize for position changes, writing
 * every measured rect into the shared node-rects store.
 *
 * Returns a cleanup function that disconnects observers and removes listeners.
 * Call again with a fresh `nodeIds` array whenever the visible node set changes.
 */
export function createNodeRectsTracker(nodeIds: string[]): () => void {
  const observers = new Map<string, ResizeObserver>()
  const cleanups: (() => void)[] = []

  const updateRect = (nodeId: string): void => {
    const nodeEl = getHtmlElementByNodeId(nodeId)
    if (!nodeEl) {
      updateNodeRect(nodeId, null)
      return
    }
    try {
      updateNodeRect(nodeId, calculateSelectionOutline({ nodeEl }))
    } catch {
      updateNodeRect(nodeId, null)
    }
  }

  const handleScrollOrResize = (): void => {
    nodeIds.forEach(updateRect)
  }

  window.addEventListener("scroll", handleScrollOrResize, true)
  window.addEventListener("resize", handleScrollOrResize)
  cleanups.push(() => {
    window.removeEventListener("scroll", handleScrollOrResize, true)
    window.removeEventListener("resize", handleScrollOrResize)
  })

  nodeIds.forEach((nodeId) => {
    const nodeEl = getHtmlElementByNodeId(nodeId)
    if (!nodeEl) {
      updateNodeRect(nodeId, null)
      return
    }
    updateRect(nodeId)
    const observer = new ResizeObserver(() => updateRect(nodeId))
    observer.observe(nodeEl)
    observers.set(nodeId, observer)
  })

  return () => {
    observers.forEach((observer) => observer.disconnect())
    observers.clear()
    cleanups.forEach((cleanup) => cleanup())
  }
}
