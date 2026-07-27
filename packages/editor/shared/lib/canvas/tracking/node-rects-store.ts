import { createStore } from "../store/observable"

import type { NodeRect } from "../overlay/geometry"

export interface NodeRectsState {
  rects: Record<string, NodeRect | null>
}

export const nodeRectsStore = createStore<NodeRectsState>({ rects: {} })

export function updateNodeRect(nodeId: string, rect: NodeRect | null): void {
  nodeRectsStore.setState((state) => ({
    rects: { ...state.rects, [nodeId]: rect },
  }))
}

export function getNodeRect(nodeId: string): NodeRect | null {
  return nodeRectsStore.getState().rects[nodeId] ?? null
}
