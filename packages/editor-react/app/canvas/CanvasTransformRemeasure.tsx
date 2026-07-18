"use client"

import { useEffect, useRef } from "react"
import { useTransformContext } from "react-zoom-pan-pinch"
import { useCanvasRemeasureStore } from "./hooks/use-canvas-remeasure-store"

/** Trailing delay after a pan/zoom stops before re-measuring node rects. */
const SETTLE_MS = 60

/**
 * Tracks pan and zoom so the wireframe boxes hide while the canvas moves and
 * redraw once it stops. The wireframe node-rect tracker lives outside the
 * transform and only listens to scroll and resize, so a trackpad pan (a
 * transform change, not a scroll) would otherwise leave its boxes at the pre-pan
 * position. Mounted inside the transform so it can read `onChange`.
 *
 * On settle it re-measures while the boxes are still hidden, then shows them on
 * the next frame so they appear directly at the new position without a flash.
 */
export function CanvasTransformRemeasure() {
  const transformContext = useTransformContext()
  const transformContextRef = useRef(transformContext)
  transformContextRef.current = transformContext

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null
    let raf = 0

    const schedule = () => {
      useCanvasRemeasureStore.getState().setTransforming(true)
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        const store = useCanvasRemeasureStore.getState()
        // Re-measure while still hidden, then reveal on the next frame so the
        // boxes paint at the settled position rather than the stale one.
        store.bump()
        raf = requestAnimationFrame(() => store.setTransforming(false))
      }, SETTLE_MS)
    }

    const unsubscribe = transformContextRef.current.onChange(schedule)

    return () => {
      if (timer) clearTimeout(timer)
      cancelAnimationFrame(raf)
      unsubscribe()
      useCanvasRemeasureStore.getState().setTransforming(false)
    }
  }, [])

  return null
}
