import { create } from "zustand"

export interface NodeRect {
  top: number
  left: number
  width: number
  height: number
}

interface NodeRectsState {
  rects: Record<string, NodeRect | null>

  // Actions
  updateRect: (nodeId: string, rect: NodeRect | null) => void
}

export const useNodeRectsStore = create<NodeRectsState>((set) => ({
  rects: {},

  updateRect: (nodeId: string, rect: NodeRect | null) => {
    set((state) => ({
      rects: {
        ...state.rects,
        [nodeId]: rect,
      },
    }))
  },
}))
