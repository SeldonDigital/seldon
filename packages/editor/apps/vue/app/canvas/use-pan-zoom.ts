import { useZoomControlsStore } from "@app/canvas/zoom-controls-store"
import { createPanZoomEngine } from "@seldon/editor/lib/canvas/pan-zoom/pan-zoom-engine"
import { type Ref, onBeforeUnmount, onMounted, ref, watch } from "vue"

const MIN_SCALE = 0.1
const MAX_SCALE = 4
const ZOOM_STEP = 1.2

/**
 * Pan and zoom for the canvas viewport, a thin composable over the shared
 * `createPanZoomEngine`. Wheel with Ctrl/Cmd zooms toward the cursor; a plain
 * wheel pans; holding space or the middle button drags to pan. Watches the
 * zoom-controls store counters so the topbar buttons and shortcuts drive the
 * same transform.
 */
export function usePanZoom(viewport: Ref<HTMLElement | null>) {
  const engine = createPanZoomEngine({
    getViewport: () => viewport.value,
    minScale: MIN_SCALE,
    maxScale: MAX_SCALE,
    zoomStep: ZOOM_STEP,
  })
  const zoom = useZoomControlsStore()

  const scale = ref(1)
  const translateX = ref(0)
  const translateY = ref(0)
  const isPanning = ref(false)

  function sync(): void {
    const transform = engine.getTransform()
    scale.value = transform.scale
    translateX.value = transform.x
    translateY.value = transform.y
    isPanning.value = engine.isPanning()
  }

  const unsubscribe = engine.subscribe(sync)

  watch(
    () => zoom.zoomInCounter,
    () => engine.zoomIn(),
  )
  watch(
    () => zoom.zoomOutCounter,
    () => engine.zoomOut(),
  )
  watch(
    () => zoom.resetZoomCounter,
    () => engine.reset(),
  )

  onMounted(() => engine.attach())
  onBeforeUnmount(() => {
    unsubscribe()
    engine.destroy()
  })

  return {
    scale,
    translateX,
    translateY,
    isPanning,
    onWheel: engine.onWheel,
    onPointerDown: engine.onPointerDown,
    onPointerMove: engine.onPointerMove,
    onPointerUp: engine.onPointerUp,
    zoomCentered: engine.zoomCentered,
    resetView: engine.reset,
  }
}
