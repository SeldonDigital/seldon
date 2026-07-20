import { defineStore } from "pinia"
import { ref } from "vue"

import {
  NORMAL_STATE,
  type NodeState,
} from "@seldon/core/workspace/model/node-state"

/**
 * Per-board active interaction state for the canvas. The board state switcher
 * writes it and the canvas reads it to render the selected state. Keyed by board
 * key; a missing entry means the Normal state. Mirrors the React
 * `use-board-state-store`.
 */
export const useBoardStateStore = defineStore("board-state", () => {
  const activeStates = ref<Record<string, NodeState>>({})

  function setActiveState(boardKey: string, state: NodeState): void {
    activeStates.value = { ...activeStates.value, [boardKey]: state }
  }

  function getActiveState(boardKey: string): NodeState {
    return activeStates.value[boardKey] ?? NORMAL_STATE
  }

  return { activeStates, setActiveState, getActiveState }
})
