import { create } from "zustand"

/**
 * Global flag for an in-progress layer reorder drag in the properties sidebar.
 * Set by the layer drag monitor on drag start and cleared on drop. Drop bands
 * read it so they only intercept pointer events while a drag is active, leaving
 * the row's controls clickable the rest of the time.
 */
interface LayerDragState {
  isLayerDragging: boolean
  setIsLayerDragging: (isLayerDragging: boolean) => void
}

export const useLayerDragStateStore = create<LayerDragState>((set) => ({
  isLayerDragging: false,
  setIsLayerDragging: (isLayerDragging) => set({ isLayerDragging }),
}))
