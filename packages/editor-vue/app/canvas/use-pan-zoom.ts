import { onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue"
import { useZoomControlsStore } from "@app/stores/zoom-controls-store"

const MIN_SCALE = 0.1
const MAX_SCALE = 4
const ZOOM_STEP = 1.2

/**
 * Pan and zoom for the canvas viewport. Wheel with Ctrl/Cmd zooms toward the
 * cursor; a plain wheel pans; holding space or the middle button drags to pan.
 * Watches the zoom-controls store counters so the topbar buttons and shortcuts
 * drive the same transform. Mirrors the behavior of the React canvas panzoom.
 */
export function usePanZoom(viewport: Ref<HTMLElement | null>) {
  const scale = ref(1)
  const translateX = ref(0)
  const translateY = ref(0)
  const isPanning = ref(false)
  const zoom = useZoomControlsStore()

  let spaceDown = false
  let lastX = 0
  let lastY = 0

  function clampScale(value: number): number {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value))
  }

  function zoomAt(clientX: number, clientY: number, factor: number): void {
    const el = viewport.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = clientX - rect.left
    const py = clientY - rect.top
    const nextScale = clampScale(scale.value * factor)
    const ratio = nextScale / scale.value
    // Keep the point under the cursor fixed while scaling.
    translateX.value = px - (px - translateX.value) * ratio
    translateY.value = py - (py - translateY.value) * ratio
    scale.value = nextScale
  }

  function zoomCentered(factor: number): void {
    const el = viewport.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor)
  }

  function resetView(): void {
    scale.value = 1
    translateX.value = 0
    translateY.value = 0
  }

  function onWheel(event: WheelEvent): void {
    event.preventDefault()
    if (event.ctrlKey || event.metaKey) {
      const factor = event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP
      zoomAt(event.clientX, event.clientY, factor)
      return
    }
    translateX.value -= event.deltaX
    translateY.value -= event.deltaY
  }

  function onPointerDown(event: PointerEvent): void {
    const panButton = event.button === 1 || (event.button === 0 && spaceDown)
    if (!panButton) return
    event.preventDefault()
    isPanning.value = true
    lastX = event.clientX
    lastY = event.clientY
    ;(event.target as HTMLElement).setPointerCapture?.(event.pointerId)
  }

  function onPointerMove(event: PointerEvent): void {
    if (!isPanning.value) return
    translateX.value += event.clientX - lastX
    translateY.value += event.clientY - lastY
    lastX = event.clientX
    lastY = event.clientY
  }

  function onPointerUp(): void {
    isPanning.value = false
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (event.code === "Space") spaceDown = true
  }
  function onKeyUp(event: KeyboardEvent): void {
    if (event.code === "Space") spaceDown = false
  }

  watch(
    () => zoom.zoomInCounter,
    () => zoomCentered(ZOOM_STEP),
  )
  watch(
    () => zoom.zoomOutCounter,
    () => zoomCentered(1 / ZOOM_STEP),
  )
  watch(
    () => zoom.resetZoomCounter,
    () => resetView(),
  )

  onMounted(() => {
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
  })
  onBeforeUnmount(() => {
    window.removeEventListener("keydown", onKeyDown)
    window.removeEventListener("keyup", onKeyUp)
  })

  return {
    scale,
    translateX,
    translateY,
    isPanning,
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    zoomCentered,
    resetView,
  }
}
