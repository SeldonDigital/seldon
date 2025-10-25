import { useEffect } from "react"
import { invariant } from "@seldon/core/index"
import { getHtmlElementByNodeId } from "../../helpers/get-html-element-by-node-id"
import { NodeRect, useNodeRectsStore } from "./use-node-rects-store"

function calculateNodeRect({ nodeEl }: { nodeEl: HTMLElement }): NodeRect {
  const canvasEl = document.getElementById("canvas")
  invariant(canvasEl, "canvas element not found")
  const elementRect = nodeEl.getBoundingClientRect()
  const canvasRect = canvasEl.getBoundingClientRect()
  const top = elementRect.top - canvasRect.top
  const left = elementRect.left - canvasRect.left

  return {
    top: top,
    left: left,
    width: elementRect.width,
    height: elementRect.height,
  }
}

/**
 * Track the rects and sizes of the nodes on the canvas.
 * Warning! This hook relies on the nodeIds array being unstable and recreated everytime the workspace changes.
 *
 * @param nodeIds - The ids of the nodes to track.
 */
export function useTrackNodeRects(nodeIds: string[]) {
  useEffect(() => {
    const screenEl = document.getElementById("root-tree")
    if (!screenEl) return

    const store = useNodeRectsStore.getState()

    nodeIds.forEach((nodeId) => {
      const nodeEl = getHtmlElementByNodeId(nodeId)
      if (!nodeEl) {
        store.updateRect(nodeId, null)
        return
      }

      const update = () => {
        const currentNodeEl = getHtmlElementByNodeId(nodeId)
        if (!currentNodeEl) {
          store.updateRect(nodeId, null)
          return
        }
        store.updateRect(
          nodeId,
          calculateNodeRect({
            nodeEl: currentNodeEl,
          }),
        )
      }

      // Initial
      update()
    })
  }, [nodeIds])
}
