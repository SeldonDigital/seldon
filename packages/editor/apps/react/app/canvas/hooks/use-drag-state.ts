import { create } from "zustand"

/**
 * Global state for an in-progress node drag, from the objects sidebar or from the
 * canvas. Set on drag start and cleared on drop. The canvas reads it to hide the
 * outlines that would compete with the drop marks, such as selection and hover.
 */
interface DragState {
  isDragging: boolean
  setIsDragging: (isDragging: boolean) => void
}

export const useDragStateStore = create<DragState>((set) => ({
  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),
}))
