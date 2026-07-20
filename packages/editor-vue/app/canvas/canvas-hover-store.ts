import type { Placement } from "@seldon/editor/lib/types"
import { defineStore } from "pinia"
import { ref } from "vue"

import { InstanceId, VariantId } from "@seldon/core"
import type { BoardKey } from "@seldon/core/workspace/types"

interface BaseHoverState {
  /** Whether the cursor is over the top/left half of the object. */
  placement: Placement
  /** Child node closest to the left or top of the cursor. */
  lastChildNodeBeforeCursor: InstanceId | VariantId | null
}

export type HoverState =
  | (BaseHoverState & { objectId: BoardKey; objectType: "board" })
  | (BaseHoverState & {
      objectId: InstanceId | VariantId
      objectType: "node"
    })

/**
 * Component-insertion hover state used by the canvas to place a new component.
 * Mirrors the React `use-canvas-hover-state` store. Kept separate from select
 * hover (`object-hover-store`) so insertion and selection stay decoupled.
 */
export const useCanvasHoverStore = defineStore("canvas-hover", () => {
  const hoverState = ref<HoverState | null>(null)

  function setHoverState(next: HoverState | null): void {
    hoverState.value = next
  }

  return { hoverState, setHoverState }
})
