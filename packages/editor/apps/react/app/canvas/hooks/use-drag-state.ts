import { create } from "zustand"

/**
 * Global state for an in-progress objects-sidebar drag. Set by the drag monitor
 * on drag start and cleared on drop. The canvas reads it to hide overlays that
 * cannot follow a node mid-reorder, such as the selection outline.
 */
interface DragState {
  isDragging: boolean
  setIsDragging: (isDragging: boolean) => void
}

export const useDragStateStore = create<DragState>((set) => ({
  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),
}))
