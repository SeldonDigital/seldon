import { getCanvasElement } from "@seldon/editor/lib/canvas/dom/canvas-elements"
import { onBeforeUnmount, onMounted } from "vue"

import type { PanZoomTransform } from "@seldon/editor/lib/canvas/pan-zoom/pan-zoom-engine"

/**
 * Holds the board still when the canvas pane changes width.
 *
 * The board is flex-centered in the canvas pane, so its base position is halfway
 * across it. Toggling a sidebar or the properties palette changes the pane's
 * width, which moves that center and slides the board even though nothing
 * panned. This watches the pane's width and shifts the pan by half the change
 * the other way, so the board keeps its place on screen. Vertical needs no such
 * fix: the board is top-anchored, so a height change does not move it. Mirrors
 * the React `CanvasResizeAnchor`.
 */
export function useCanvasResizeAnchor(
  getTransform: () => PanZoomTransform,
  setTransform: (x: number, y: number, scale: number) => void,
): void {
  let width: number | null = null
  let observer: ResizeObserver | null = null
  let innerRaf = 0
  let outerRaf = 0

  onMounted(() => {
    const canvas = getCanvasElement()

    if (!canvas) return

    // The board is centered by CSS at whatever width the pane settles to on
    // launch, so the initial layout is not a move to hold against. Observing is
    // deferred past the mount settle, and the baseline is then taken from the
    // first callback rather than measured up front. Compensating for the settle
    // would push the board offscreen on launch; only a later change, from
    // toggling a sidebar or the palette, is a real move to hold.
    const start = (): void => {
      observer = new ResizeObserver((entries) => {
        const next = entries[0]?.contentRect.width

        if (next === undefined) return

        if (width === null) {
          width = next

          return
        }

        const delta = next - width

        width = next

        if (delta === 0) return
        const { x, y, scale } = getTransform()

        setTransform(x - delta / 2, y, scale)
      })

      observer.observe(canvas)
    }

    outerRaf = requestAnimationFrame(() => {
      innerRaf = requestAnimationFrame(start)
    })
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(outerRaf)
    cancelAnimationFrame(innerRaf)
    observer?.disconnect()
  })
}
