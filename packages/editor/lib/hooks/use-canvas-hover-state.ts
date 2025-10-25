import { Placement } from "@lib/types"
import { create } from "zustand"
import { InstanceId, VariantId } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"

interface BaseHoverState {
  /** Whether the user is hovering over the top (vertical) or left (horizontal) part of the object */
  placement: Placement
  /** ID of the child node that is closest to the left or top of the cursor */
  lastChildNodeBeforeCursor: InstanceId | VariantId | null
}

export type HoverState =
  | (BaseHoverState & {
      /** ID of the board being hovered over */
      objectId: ComponentId
      objectType: "board"
    })
  | (BaseHoverState & {
      /** ID of the node being hovered over */
      objectId: InstanceId | VariantId
      objectType: "node"
    })

interface CanvasState {
  hoverState: HoverState | null
  setHoverState: (hoverState: HoverState | null) => void
}
const useStore = create<CanvasState>((set) => ({
  hoverState: null,
  setHoverState: (hoverState: HoverState | null) => set(() => ({ hoverState })),
}))

export function useCanvasHoverState() {
  const { hoverState, setHoverState } = useStore()

  return {
    hoverState,
    setHoverState,
  }
}
