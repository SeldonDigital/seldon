"use client"

import { measureNodeRect } from "@seldon/editor/lib/canvas/tracking/node-rects-tracker"
import { useEffect } from "react"

import { useCanvasRemeasureStore } from "../../../../canvas/hooks/use-canvas-remeasure-store"

/**
 * Keeps the given nodes measured while the canvas pans or zooms.
 *
 * The shared tracker measures on scroll, on resize, and once a transform settles, which
 * is enough for a box drawn over its node, since the whole layer is hidden until the
 * canvas stops. A connector is drawn away from its node and has to stay on screen while
 * the canvas moves, so the rect it points at has to keep up.
 *
 * Only the nodes the connectors reference are measured, and only while the canvas is
 * moving, which keeps this off the tracker's board-wide passes.
 */
export function useFollowCanvasTransform(nodeIds: Set<string>): void {
  const isTransforming = useCanvasRemeasureStore((state) => state.isTransforming)

  useEffect(() => {
    if (!isTransforming || nodeIds.size === 0) return

    let frame = 0

    const measure = () => {
      nodeIds.forEach(measureNodeRect)
      frame = requestAnimationFrame(measure)
    }

    frame = requestAnimationFrame(measure)

    return () => cancelAnimationFrame(frame)
  }, [isTransforming, nodeIds])
}
