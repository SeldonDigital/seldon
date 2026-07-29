import { useSharedStore } from "@app/canvas/use-shared-store"
import { remeasureStore } from "@seldon/editor/lib/canvas/remeasure/remeasure-store"
import { measureNodeRect } from "@seldon/editor/lib/canvas/tracking/node-rects-tracker"
import { onScopeDispose, watch } from "vue"

import type { Ref } from "vue"

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
 *
 * Mirrors the React `useFollowCanvasTransform`.
 */
export function useFollowCanvasTransform(nodeIds: Ref<Set<string>>): void {
  const isTransforming = useSharedStore(remeasureStore, (state) => state.isTransforming)

  let frame = 0

  function stop(): void {
    if (!frame) return

    cancelAnimationFrame(frame)
    frame = 0
  }

  watch(
    [isTransforming, nodeIds],
    ([transforming, ids]) => {
      stop()

      if (!transforming || ids.size === 0) return

      const measure = () => {
        ids.forEach(measureNodeRect)
        frame = requestAnimationFrame(measure)
      }

      frame = requestAnimationFrame(measure)
    },
    { immediate: true },
  )

  onScopeDispose(stop)
}
