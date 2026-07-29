import { getCanvasElement } from "@seldon/editor/lib/canvas/dom/canvas-elements"
import { onMounted, onScopeDispose, ref } from "vue"

import type { Ref } from "vue"

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
 *
 * Mirrors the React `useCanvasSize`.
 */
export function useCanvasSize(): Ref<CanvasSize> {
  const size = ref<CanvasSize>({ width: 0, height: 0 })

  onMounted(() => {
    const canvasEl = getCanvasElement()

    if (!canvasEl) return

    const measure = () => {
      const rect = canvasEl.getBoundingClientRect()

      if (size.value.width === rect.width && size.value.height === rect.height) return

      size.value = { width: rect.width, height: rect.height }
    }

    measure()

    const observer = new ResizeObserver(measure)

    observer.observe(canvasEl)
    onScopeDispose(() => observer.disconnect())
  })

  return size
}
