import { Placement } from "@seldon/editor/lib/types"
import { create } from "zustand"

import { InstanceId, VariantId } from "@seldon/core"
import type { BoardKey } from "@seldon/core/workspace/types"

interface BaseHoverState {
  /** Whether the user is hovering over the top (vertical) or left (horizontal) part of the object */
  placement: Placement
  /** ID of the child node that is closest to the left or top of the cursor */
  lastChildNodeBeforeCursor: InstanceId | VariantId | null
}

export type HoverState =
  | (BaseHoverState & {
      /** ID of the board being hovered over */
      objectId: BoardKey
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

/**
 * The hover setter only. Subscribing to this never re-renders on hover changes,
 * so handlers that merely write hover state stay cheap.
 */
export const useSetHoverState = (): CanvasState["setHoverState"] =>
  useStore((state) => state.setHoverState)

/**
 * Reads the current hover state imperatively without subscribing. Use inside
 * event handlers (e.g. mouse-leave) that must not re-render on every hover.
 */
export const getHoverStateSnapshot = (): HoverState | null =>
  useStore.getState().hoverState

/**
 * Subscribes to the hover state only while it targets the given object id,
 * returning null otherwise. Non-matching consumers keep a stable null and never
 * re-render on hover, so only the entering and leaving rows update.
 */
export const useHoverStateForObject = (objectId: string): HoverState | null =>
  useStore((state) =>
    state.hoverState?.objectId === objectId ? state.hoverState : null,
  )

/**
 * Subscribes to the hover state only while it targets one of the given object
 * ids, returning null otherwise. Used by rows whose placement zones react to
 * hover on the row itself or its parent, so only those rows re-render.
 */
export const useHoverStateForObjects = (
  objectIds: Array<string | null | undefined>,
): HoverState | null =>
  useStore((state) =>
    state.hoverState && objectIds.includes(state.hoverState.objectId)
      ? state.hoverState
      : null,
  )

/** Whether anything is currently hovered (cheap boolean subscription). */
export const useHasHoverState = (): boolean =>
  useStore((state) => state.hoverState !== null)
