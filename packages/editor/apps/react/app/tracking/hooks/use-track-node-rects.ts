import { createNodeRectsTracker } from "@seldon/editor/lib/canvas/tracking/node-rects-tracker"
import { useEffect } from "react"

import { useCanvasRemeasureStore } from "../../canvas/hooks/use-canvas-remeasure-store"

/**
 * Tracks the position and size of the given nodes on the canvas by mounting the
 * shared node-rects tracker for the current node set.
 *
 * **Warning:** relies on `nodeIds` being recreated whenever the workspace
 * changes so new and removed nodes are re-tracked.
 *
 * @param nodeIds - The IDs of the nodes to track
 */
export function useTrackNodeRects(nodeIds: string[]) {
  // Re-measure once a reorder glide settles. The initial pass after a commit
  // measures the pre-animation position, so without this the wireframe boxes
  // would stay at the old spot until the next render.
  const remeasureVersion = useCanvasRemeasureStore((state) => state.version)

  useEffect(() => {
    return createNodeRectsTracker(nodeIds)
  }, [nodeIds, remeasureVersion])
}
