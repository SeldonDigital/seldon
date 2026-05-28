import { useEffect } from "react"
import { getHtmlElementByNodeId } from "../../canvas/helpers/get-html-element-by-node-id"
import { calculateNodeRect } from "../utils/calculate-node-rect"
import { useNodeRectsStore } from "./use-node-rects-store"

/**
 * Tracks the position and size of nodes on the canvas.
 * Uses ResizeObserver to handle dynamic size changes and scroll/resize events for position updates.
 *
 * **Warning:** This hook relies on the `nodeIds` array being unstable and recreated
 * every time the workspace changes to properly track new/removed nodes.
 *
 * @param nodeIds - The IDs of the nodes to track
 */
export function useTrackNodeRects(nodeIds: string[]) {
  useEffect(() => {
    const store = useNodeRectsStore.getState()
    const observers = new Map<string, ResizeObserver>()
    const cleanupFunctions: (() => void)[] = []

    const updateRect = (nodeId: string) => {
      const nodeEl = getHtmlElementByNodeId(nodeId)
      if (!nodeEl) {
        store.updateRect(nodeId, null)
        return
      }

      try {
        const rect = calculateNodeRect({ nodeEl })
        store.updateRect(nodeId, rect)
      } catch {
        store.updateRect(nodeId, null)
      }
    }

    // Handle scroll and resize events for all nodes
    const handleScrollOrResize = () => {
      nodeIds.forEach((nodeId) => {
        updateRect(nodeId)
      })
    }

    // Set up scroll and resize listeners
    window.addEventListener("scroll", handleScrollOrResize, true)
    window.addEventListener("resize", handleScrollOrResize)
    cleanupFunctions.push(() => {
      window.removeEventListener("scroll", handleScrollOrResize, true)
      window.removeEventListener("resize", handleScrollOrResize)
    })

    // Set up ResizeObserver for each node to handle size changes
    nodeIds.forEach((nodeId) => {
      const nodeEl = getHtmlElementByNodeId(nodeId)
      if (!nodeEl) {
        store.updateRect(nodeId, null)
        return
      }

      // Initial update
      updateRect(nodeId)

      // Create ResizeObserver to watch for size changes
      const observer = new ResizeObserver(() => {
        updateRect(nodeId)
      })
      observer.observe(nodeEl)
      observers.set(nodeId, observer)
    })

    // Cleanup function
    return () => {
      observers.forEach((observer) => observer.disconnect())
      observers.clear()
      cleanupFunctions.forEach((cleanup) => cleanup())
    }
  }, [nodeIds])
}
