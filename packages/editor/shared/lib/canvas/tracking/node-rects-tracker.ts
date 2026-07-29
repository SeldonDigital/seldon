import { getHtmlElementByNodeId } from "../dom/canvas-elements"
import { calculateSelectionOutline } from "../overlay/measure"
import { removeNodeRectsExcept, updateNodeRect } from "./node-rects-store"

/**
 * Measures one node against the canvas and writes the result to the shared
 * node-rects store, storing null when the node is gone or cannot be measured.
 *
 * Exposed for overlays that need a rect fresher than the tracker's own passes,
 * such as connectors following a pan frame by frame.
 */
export function measureNodeRect(nodeId: string): void {
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

/**
 * Tracks the position and size of nodes on the canvas. Uses a ResizeObserver per
 * node for size changes and window scroll/resize for position changes, writing
 * every measured rect into the shared node-rects store.
 *
 * Returns a cleanup function that disconnects observers and removes listeners.
 * Call again with a fresh `nodeIds` array whenever the visible node set changes.
 *
 * Nodes outside the new set are forgotten as it starts, so the board that was left
 * stops being measured and stops being paid for.
 */
export function createNodeRectsTracker(nodeIds: string[]): () => void {
  const observers = new Map<string, ResizeObserver>()
  const cleanups: (() => void)[] = []

  removeNodeRectsExcept(nodeIds)

  const handleScrollOrResize = (): void => {
    nodeIds.forEach(measureNodeRect)
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

    measureNodeRect(nodeId)
    const observer = new ResizeObserver(() => measureNodeRect(nodeId))

    observer.observe(nodeEl)
    observers.set(nodeId, observer)
  })

  return () => {
    observers.forEach((observer) => observer.disconnect())
    observers.clear()
    cleanups.forEach((cleanup) => cleanup())
  }
}
