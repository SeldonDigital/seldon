import { getCanvasElement } from "@seldon/editor/lib/canvas/dom/canvas-elements"
import { useEffect, useState } from "react"

export interface CanvasSize {
  width: number
  height: number
}

/**
 * The canvas viewport size in chrome pixels, tracked as it changes.
 *
 * An overlay that places chrome against the canvas edge needs this, unlike the
 * outline overlays that only ever measure a node. Observing the element rather
 * than the window also catches a sidebar resize, which moves the canvas edge
 * without a window resize event.
 */
export function useCanvasSize(): CanvasSize {
  const [size, setSize] = useState<CanvasSize>({ width: 0, height: 0 })

  useEffect(() => {
    const canvasEl = getCanvasElement()

    if (!canvasEl) return

    const measure = () => {
      const rect = canvasEl.getBoundingClientRect()

      setSize((current) =>
        current.width === rect.width && current.height === rect.height
          ? current
          : { width: rect.width, height: rect.height },
      )
    }

    measure()

    const observer = new ResizeObserver(measure)

    observer.observe(canvasEl)

    return () => observer.disconnect()
  }, [])

  return size
}
