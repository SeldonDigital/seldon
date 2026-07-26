import { defineStore } from "pinia"
import { ref } from "vue"

/**
 * Event-counter zoom controls. The canvas watches the counters and performs the
 * actual zoom, avoiding storing functions that could cause update loops.
 * Mirrors the React `use-zoom-controls` store.
 */
export const useZoomControlsStore = defineStore("zoom-controls", () => {
  const zoomInCounter = ref(0)
  const zoomOutCounter = ref(0)
  const resetZoomCounter = ref(0)

  function zoomIn(): void {
    zoomInCounter.value += 1
  }

  function zoomOut(): void {
    zoomOutCounter.value += 1
  }

  function resetZoom(): void {
    resetZoomCounter.value += 1
  }

  return {
    zoomInCounter,
    zoomOutCounter,
    resetZoomCounter,
    zoomIn,
    zoomOut,
    resetZoom,
  }
})
