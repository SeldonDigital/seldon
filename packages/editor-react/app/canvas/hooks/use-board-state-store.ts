import { create } from "zustand"
import {
  NORMAL_STATE,
  type NodeState,
} from "@seldon/core/workspace/model/node-state"

/**
 * Per-board active interaction state for the canvas. The board state switcher
 * writes it and the canvas reads it to render and edit the selected state.
 * Keyed by board key. A missing entry means the Normal state.
 */
interface BoardStateStore {
  activeStates: Record<string, NodeState>
  setActiveState: (boardKey: string, state: NodeState) => void
}

export const useBoardStateStore = create<BoardStateStore>((set) => ({
  activeStates: {},
  setActiveState: (boardKey, state) =>
    set((current) => ({
      activeStates: { ...current.activeStates, [boardKey]: state },
    })),
}))

/** Reactive read of one board's active state, defaulting to Normal. */
export function useActiveBoardState(boardKey: string): NodeState {
  return useBoardStateStore(
    (store) => store.activeStates[boardKey] ?? NORMAL_STATE,
  )
}
