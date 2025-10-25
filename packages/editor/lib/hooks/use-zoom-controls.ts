import { create } from "zustand"

// Using an event-based approach instead of storing functions to avoid infinite update loops
interface ZoomControlsState {
  // Event counter to trigger zoom actions
  zoomInCounter: number
  zoomOutCounter: number
  resetZoomCounter: number

  // Actions to trigger zoom events
  triggerZoomIn: () => void
  triggerZoomOut: () => void
  triggerResetZoom: () => void
}

export const useZoomControlsStore = create<ZoomControlsState>((set) => ({
  zoomInCounter: 0,
  zoomOutCounter: 0,
  resetZoomCounter: 0,

  triggerZoomIn: () =>
    set((state) => ({ zoomInCounter: state.zoomInCounter + 1 })),
  triggerZoomOut: () =>
    set((state) => ({ zoomOutCounter: state.zoomOutCounter + 1 })),
  triggerResetZoom: () =>
    set((state) => ({ resetZoomCounter: state.resetZoomCounter + 1 })),
}))

/**
 * Hook to trigger zoom controls from anywhere in the app
 */
export function useZoomControls() {
  const { triggerZoomIn, triggerZoomOut, triggerResetZoom } =
    useZoomControlsStore()

  return {
    zoomIn: () => triggerZoomIn(),
    zoomOut: () => triggerZoomOut(),
    resetZoom: () => triggerResetZoom(),
  }
}
